import type { FunctionalComponent } from "preact"; 
import type { RoutableProps } from "preact-router";
import { useState, useEffect } from "preact/hooks";
import { route } from "preact-router";
import {
  User, Mail, GraduationCap, BookOpen, University, BarChart3,
} from "lucide-react";

const calculateCGPA = (results: any[]) => {
  if (results.length === 0) return null;
  let totalGpa = 0;
  let count = 0;
  results.forEach(r => {
    if (r.gpa !== undefined && r.gpa !== null) {
      totalGpa += Number(r.gpa);
      count++;
    }
  });
  return count > 0 ? totalGpa / count : null;
};

const Dashboard: FunctionalComponent<RoutableProps> = () => {
  const [user, setUser] = useState<any>(null);
  const [results, setResults] = useState<any[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const currentUser = localStorage.getItem("currentUser");
    if (!token || !currentUser) {
      route("/login");
      return;
    }
    const userObj = JSON.parse(currentUser);
    setUser(userObj);

    const fetchResults = async () => {
      try {
        const res = await fetch(`/api/result/user?userId=${userObj._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        } else {
          setResults([]);
        }
      } catch {
        setResults([]);
      }
    };
    fetchResults();

    const handleVisibility = () => {
      if (document.visibilityState === "visible") fetchResults();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    const interval = setInterval(fetchResults, 5000);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      clearInterval(interval);
    };
  }, []);

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  if (!isLoggedIn) {
    route("/login");
    return null;
  }

  const sortedResults = [...results].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const visibleResults = sortedResults.filter(r => !deletedIds.includes(r._id));

  const latestResult = visibleResults.length > 0 ? visibleResults[0] : null;
  const currentCGPA = calculateCGPA(visibleResults);

  // ✅ Handle delete confirmation
  const confirmDelete = () => {
    if (selectedResult) {
      setDeletedIds([...deletedIds, selectedResult._id]);
      setShowModal(false);
      setSelectedResult(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 w-full">
      {/* Navbar */}
      <nav className="fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-7xl -translate-x-1/2 rounded-[2rem] bg-white/95 border border-slate-200 shadow-xl shadow-slate-200/40 backdrop-blur-sm">
        <div className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 font-bold">G</div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-950">GPA Tracker</p>
              <p className="text-xs text-slate-500">Student performance hub</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-slate-600">
            <button onClick={() => route('/')} className="transition hover:text-blue-700">Overview</button>
            <button onClick={() => route('/dashboard')} className="transition text-slate-900 font-semibold">Dashboard</button>
            <button onClick={() => route('/gpa-calculate')} className="transition hover:text-blue-700">Calculate</button>
            <button className="relative rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100">
              Updates
              <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-semibold text-white">3</span>
            </button>
          </div>

          <div className="flex items-center gap-3 justify-between md:justify-end">
            <div className="hidden md:flex flex-col text-right text-sm text-slate-500">
              <span className="text-slate-900 font-semibold">{user ? `${user.firstName} ${user.lastName}` : 'Guest'}</span>
              <span>Welcome back</span>
            </div>
            <div className="flex items-center gap-2">
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    localStorage.removeItem("isLoggedIn");
                    localStorage.removeItem("token");
                    localStorage.removeItem("currentUser");
                    route("/login");
                  }}
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                >
                  Sign Out
                </button>
              ) : (
                <button onClick={() => route('/login')} className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">Login</button>
              )}
              <button
                className="md:hidden p-2 rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label="Toggle menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile dropdown when hamburger is toggled */}
      {menuOpen && (
        <div className="md:hidden fixed right-4 top-24 z-50 w-56 rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40 p-4">
          <ul className="flex flex-col gap-3">
            <li><button onClick={() => { route('/'); setMenuOpen(false); }} className="text-left w-full text-sm text-slate-700 hover:text-blue-600">Overview</button></li>
            <li><button onClick={() => { route('/dashboard'); setMenuOpen(false); }} className="text-left w-full text-sm text-slate-700 hover:text-blue-600">Dashboard</button></li>
            <li><button onClick={() => { route('/gpa-calculate'); setMenuOpen(false); }} className="text-left w-full text-sm text-slate-700 hover:text-blue-600">Calculate</button></li>
            {isLoggedIn ? (
              <li><button onClick={() => { localStorage.removeItem('isLoggedIn'); localStorage.removeItem('token'); localStorage.removeItem('currentUser'); route('/login'); setMenuOpen(false); }} className="text-left w-full text-sm text-red-600">Sign Out</button></li>
            ) : (
              <li><button onClick={() => { route('/login'); setMenuOpen(false); }} className="text-left w-full text-sm text-slate-700">Login</button></li>
            )}
          </ul>
        </div>
      )}

      {/* Dashboard Content */}
      <div className="flex flex-col items-center justify-center px-4 sm:px-6 pt-32 pb-10 w-full">
        <div className="w-full max-w-7xl space-y-8">
          <section className="rounded-[2rem] bg-white p-8 shadow-sm border border-slate-200">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm uppercase tracking-[0.24em] text-blue-600 font-semibold">Student Dashboard</p>
                <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">Your semester performance at a glance</h1>
                <p className="mt-4 text-sm leading-6 text-slate-600">Track your GPA progress, recent results, and quick actions from one clean workspace designed for clarity and focus.</p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-3xl bg-slate-50 p-4 text-center border border-slate-200">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Records</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">{visibleResults.length}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4 text-center border border-slate-200">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Latest GPA</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">{latestResult?.gpa !== undefined ? Number(latestResult.gpa).toFixed(2) : 'N/A'}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4 text-center border border-slate-200">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Current CGPA</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">{currentCGPA !== null ? currentCGPA.toFixed(2) : 'N/A'}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Profile + Quick Stats */}
          {user && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full items-stretch">
              {/* Profile */}
              <div className="p-5 bg-white rounded-lg shadow-sm border border-slate-200 h-full flex flex-col justify-between min-h-[200px]">
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-500" /> Profile
                </h2>
                <div className="flex flex-col gap-3 text-sm text-slate-700">
                  <div className="flex items-center gap-2"><User className="w-5 h-5 text-blue-500" /><span>{user.firstName} {user.lastName}</span></div>
                  <div className="flex items-center gap-2"><Mail className="w-5 h-5 text-green-500" /><span>{user.email}</span></div>
                  <div className="flex items-center gap-2"><GraduationCap className="w-5 h-5 text-yellow-500" /><span>Level: {user.level}</span></div>
                  <div className="flex items-center gap-2"><BookOpen className="w-5 h-5 text-purple-500" /><span>Department: {user.department}</span></div>
                  <div className="flex items-center gap-2"><University className="w-5 h-5 text-red-500" /><span>{user.university}</span></div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="p-5 bg-white rounded-lg shadow-sm border border-slate-200 h-full">
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-500" /> Quick Stats
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 rounded-lg text-center border border-slate-200">
                    <p className="text-xl font-bold">{visibleResults.length}</p>
                    <p className="text-xs text-slate-500">Total Results</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg text-center border border-slate-200">
                    <p className="text-xl font-bold">
                      {latestResult?.gpa !== undefined ? Number(latestResult.gpa).toFixed(2) : "N/A"}
                    </p>
                    <p className="text-xs text-slate-500">Latest GPA</p>
                  </div>
                  <div className="col-span-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <p className="text-sm text-slate-500 mb-2">Current CGPA</p>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div className="bg-green-500 h-3 rounded-full" style={{ width: `${(currentCGPA || 0) * 20}%` }}></div>
                    </div>
                    <p className="text-center mt-2 font-semibold">
                      {currentCGPA !== null ? currentCGPA.toFixed(2) : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Transcript */}
            <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 mt-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-yellow-400" /> Transcript
                </h2>
                <div className="text-sm text-slate-500">Recent semesters</div>
              </div>
              {visibleResults.length > 0 ? (
                <div className="overflow-x-auto w-full">
                  <table className="min-w-full bg-white divide-y divide-slate-100 rounded-lg">
                    <thead className="bg-slate-50">
                      <tr>
                            <th className="px-3 py-2 text-left text-sm font-semibold text-slate-600">Semester</th>
                            <th className="px-3 py-2 text-left text-sm font-semibold text-slate-600">GPA</th>
                            <th className="px-3 py-2 text-left text-sm font-semibold text-slate-600">CGPA</th>
                            <th className="px-3 py-2 text-left text-sm font-semibold text-slate-600">Saved On</th>
                            <th className="px-3 py-2 text-right text-sm font-semibold text-slate-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {visibleResults.map((result, index) => (
                        <tr key={result._id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="px-3 py-2 text-sm text-slate-700">{result.semester}</td>
                          <td className="px-3 py-2 text-sm font-medium">{Number(result.gpa).toFixed(2)}</td>
                          <td className="px-3 py-2 text-sm">{Number(result.cgpa).toFixed(2)}</td>
                          <td className="px-3 py-2 text-sm text-slate-500">{new Date(result.date).toLocaleDateString()}</td>
                          <td className="px-3 py-2 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={() => { setSelectedResult(result); setShowModal(true); }}
                                className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded-md text-white text-sm"
                              >
                                Hide
                              </button>
                              <button
                                onClick={() => route(`/results/${result._id}`)}
                                className="px-2 py-1 border border-slate-200 rounded-md text-sm text-slate-700 hover:bg-slate-50"
                              >
                                View
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-6 text-center text-slate-500">No transcript data yet. Create a new calculation to get started.</div>
              )}
            </div>

          {/* Feedback */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="col-span-2 p-6 bg-white rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-semibold mb-4">Feedback</h3>
                <FeedbackForm user={user} />
              </div>
              <div className="col-span-1 p-6 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col items-start gap-4">
                <h3 className="text-lg font-semibold">Quick Actions</h3>
                <button onClick={() => route('/gpa-calculate')} className="w-full px-4 py-2 bg-blue-500 text-white rounded-md">Calculate New GPA</button>
                <button onClick={() => route('/results/export')} className="w-full px-4 py-2 border border-slate-200 rounded-md">Export Results</button>
              </div>
            </div>
        </div>
      </div>

      {/* ✅ Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center border border-slate-200">
            <h2 className="text-xl font-bold mb-4">Confirm Hide</h2>
            <p className="mb-6">Are you sure you want to hide the result for <span className="font-semibold">{selectedResult?.semester}</span>?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
              >
                Hide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FeedbackForm = ({ user }: { user: any }) => {
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?._id, username: user?.username, message }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Thank you for your feedback!");
        setMessage("");
      } else {
        setError(data.message || "Failed to submit feedback.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        className="w-full p-3 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        rows={4}
        placeholder="Share your thoughts about the app..."
        value={message}
        onInput={e => setMessage((e.target as HTMLTextAreaElement).value)}
        required
        disabled={loading}
      />
      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Feedback"}
      </button>
      {success && <p className="text-green-400 text-sm">{success}</p>}
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </form>
  );
};

export default Dashboard;
