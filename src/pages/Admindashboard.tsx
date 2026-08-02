import type { FunctionalComponent } from "preact";
import type { RoutableProps } from "preact-router";
import { useState, useEffect } from "preact/hooks";
import { route } from "preact-router";
import { Users, Shield, UserCheck, ClipboardList, LayoutDashboard } from "lucide-react";

const AdminDashboard: FunctionalComponent<RoutableProps> = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const currentUser = localStorage.getItem("currentUser");

    if (!token || !currentUser) {
      route("/login");
      return;
    }

    const user = JSON.parse(currentUser);
    if (user.role !== "admin") {
      route("/admin");
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          setError("Failed to fetch users. Make sure you are logged in as admin.");
        }
      } catch (err) {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const adminCount = users.filter((u) => u.role === "admin").length;
  const userCount = users.filter((u) => u.role !== "admin").length;

  // Feedback state
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [feedbackError, setFeedbackError] = useState("");

  useEffect(() => {
    // Fetch feedbacks
    const fetchFeedbacks = async () => {
      try {
        const res = await fetch("/api/feedback");
        if (res.ok) {
          const data = await res.json();
          setFeedbacks(data);
        } else {
          setFeedbackError("Failed to fetch feedback.");
        }
      } catch (err) {
        setFeedbackError("Network error. Please try again.");
      } finally {
        setFeedbackLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  return (
    <div className="flex flex-col bg-slate-50 text-slate-900">
      {/* Navbar */}
      <nav className="flex w-full items-center justify-between px-6 py-3 bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="w-6 h-6 text-blue-600" />
          <span className="text-xl font-semibold text-slate-950">Admin Dashboard</span>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("currentUser");
            route("/login");
          }}
          className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 transition"
        >
          Sign out
        </button>
      </nav>

      {/* Main Content */}
      <div className="px-4 sm:px-6 py-4">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm">
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-950 mb-1">Admin Dashboard</h1>
            <p className="text-slate-600">Quick overview of users and feedback.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">Total Users</p>
                  <p className="text-3xl font-bold text-slate-950 mt-2">{users.length}</p>
                </div>
                <Users className="w-10 h-10 text-blue-500/20" />
              </div>
            </div>

            <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">Admins</p>
                  <p className="text-3xl font-bold text-slate-950 mt-2">{adminCount}</p>
                </div>
                <Shield className="w-10 h-10 text-green-500/20" />
              </div>
            </div>

            <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">Regular Users</p>
                  <p className="text-3xl font-bold text-slate-950 mt-2">{userCount}</p>
                </div>
                <UserCheck className="w-10 h-10 text-purple-500/20" />
              </div>
            </div>

            <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">Feedback</p>
                  <p className="text-3xl font-bold text-slate-950 mt-2">{feedbacks.length}</p>
                </div>
                <ClipboardList className="w-10 h-10 text-amber-500/20" />
              </div>
            </div>
          </div>

          {/* Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Recent Users */}
            <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-950 mb-4">Recent Users</h2>
              {loading ? (
                <p className="text-sm text-slate-500">Loading...</p>
              ) : error ? (
                <p className="text-sm text-red-500">{error}</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {users.slice(0, 5).map((u) => (
                    <div key={u._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-900 truncate">{u.firstName} {u.lastName}</p>
                        <p className="text-xs text-slate-500 truncate">{u.email}</p>
                      </div>
                      <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${u.role === 'admin' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {u.role}
                      </span>
                    </div>
                  ))}
                  {users.length === 0 && <p className="text-sm text-slate-500">No users yet.</p>}
                </div>
              )}
            </div>

            {/* Recent Feedback */}
            <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-950 mb-4">Recent Feedback</h2>
              {feedbackLoading ? (
                <p className="text-sm text-slate-500">Loading...</p>
              ) : feedbackError ? (
                <p className="text-sm text-red-500">{feedbackError}</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {feedbacks.slice(0, 5).map((fb) => (
                    <div key={fb._id} className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-slate-900">{fb.username}</p>
                        <span className="text-xs text-slate-500">{new Date(fb.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-2">{fb.message}</p>
                    </div>
                  ))}
                  {feedbacks.length === 0 && <p className="text-sm text-slate-500">No feedback yet.</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
