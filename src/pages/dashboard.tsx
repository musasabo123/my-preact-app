import type { FunctionalComponent } from "preact";
import type { RoutableProps } from "preact-router";
import { useState, useEffect } from "preact/hooks";
import { route } from "preact-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  GraduationCap,
  BookOpen,
  University,
  BarChart3,
  TrendingUp,
  ClipboardList,
  Star,
  Search,
  ArrowUpDown,
  Eye,
  Plus,
  FileText,
  Download,
  Settings,
  Pencil,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Calendar,
  X,
  Calculator,
  LogOut,
} from "lucide-react";
import { api } from "../utils/api";

const calculateCGPA = (results: any[]) => {
  if (results.length === 0) return null;
  let totalGpa = 0;
  let count = 0;
  results.forEach((r) => {
    if (r.gpa !== undefined && r.gpa !== null) {
      totalGpa += Number(r.gpa);
      count++;
    }
  });
  return count > 0 ? totalGpa / count : null;
};

const calculateCredits = (results: any[]) => {
  let credits = 0;
  results.forEach((r) => {
    if (Array.isArray(r.courses)) {
      r.courses.forEach((c: any) => {
        credits += Number(c.units) || 0;
      });
    }
  });
  return credits;
};

const Dashboard: FunctionalComponent<RoutableProps> = () => {
  const [user, setUser] = useState<any>(null);
  const [results, setResults] = useState<any[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  // Table state
  const [search, setSearch] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("all");
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 6;

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
  const visibleResults = sortedResults.filter((r) => !deletedIds.includes(r._id));

  // Stats
  const totalResults = visibleResults.length;
  const currentCGPA = calculateCGPA(visibleResults);
  const latestResult = visibleResults.length > 0 ? visibleResults[0] : null;
  const latestGPA = latestResult?.gpa !== undefined ? Number(latestResult.gpa).toFixed(2) : "N/A";
  const totalCredits = calculateCredits(visibleResults);

  // Semester trend
  const trendData = [...visibleResults].reverse().slice(-6);
  const gpaChange =
    visibleResults.length >= 2
      ? Number(visibleResults[0].gpa) - Number(visibleResults[1].gpa)
      : 0;
  const improved = gpaChange > 0;
  const insightText =
    visibleResults.length >= 2
      ? `Your GPA ${improved ? "improved" : "dropped"} by ${Math.abs(gpaChange).toFixed(2)} from last semester.`
      : "Add more semesters to see your progress trend.";

  // Filtered + searched + sorted list
  const filteredResults = visibleResults.filter((r) => {
    const matchFilter = semesterFilter === "all" || r.semester === semesterFilter;
    const matchSearch =
      search.trim() === "" ||
      (r.semester || "").toLowerCase().includes(search.toLowerCase()) ||
      (Array.isArray(r.courses) &&
        r.courses.some((c: any) =>
          (c.code || "").toLowerCase().includes(search.toLowerCase())
        ));
    return matchFilter && matchSearch;
  });

  const sortedFiltered = [...filteredResults].sort((a, b) => {
    const diff = Number(a.gpa) - Number(b.gpa);
    return sortAsc ? diff : -diff;
  });

  const totalPages = Math.max(1, Math.ceil(sortedFiltered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginatedResults = sortedFiltered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const semesters = Array.from(new Set(visibleResults.map((r) => r.semester)));

  const confirmDelete = () => {
    if (selectedResult) {
      setDeletedIds([...deletedIds, selectedResult._id]);
      setShowModal(false);
      setSelectedResult(null);
    }
  };

  const stats = [
    {
      label: "Total Results",
      value: String(totalResults),
      icon: ClipboardList,
      iconBg: "bg-blue-50 text-blue-600",
      gradient: "from-blue-500 to-blue-400",
    },
    {
      label: "Current CGPA",
      value: currentCGPA !== null ? currentCGPA.toFixed(2) : "N/A",
      icon: BarChart3,
      iconBg: "bg-indigo-50 text-indigo-600",
      gradient: "from-indigo-500 to-indigo-400",
    },
    {
      label: "Latest GPA",
      value: latestGPA,
      icon: TrendingUp,
      iconBg: "bg-emerald-50 text-emerald-600",
      gradient: "from-emerald-500 to-emerald-400",
    },
    {
      label: "Credits Completed",
      value: String(totalCredits),
      icon: Star,
      iconBg: "bg-amber-50 text-amber-600",
      gradient: "from-amber-500 to-amber-400",
    },
  ];

  const profileItems = [
    { icon: User, label: "Name", value: user ? `${user.firstName} ${user.lastName}` : "—", color: "text-blue-500 bg-blue-50" },
    { icon: Mail, label: "Email", value: user?.email || "—", color: "text-emerald-500 bg-emerald-50" },
    { icon: GraduationCap, label: "Level", value: user?.level || "—", color: "text-violet-500 bg-violet-50" },
    { icon: BookOpen, label: "Department", value: user?.department || "—", color: "text-fuchsia-500 bg-fuchsia-50" },
    { icon: University, label: "University", value: user?.university || "—", color: "text-amber-500 bg-amber-50" },
  ];

  const quickActions = [
    { label: "Calculate GPA", icon: Plus, color: "bg-blue-500 text-white hover:bg-blue-600", action: () => route("/gpa-calculate") },
    { label: "View Transcript", icon: FileText, color: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50", action: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
    { label: "Export Results", icon: Download, color: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50", action: () => window.print() },
    { label: "Update Profile", icon: Settings, color: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50", action: () => route("/dashboard") },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 w-full">
{/* Navbar */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-4 left-1/2 z-50 w-[calc(100%-2rem)] -translate-x-1/2 rounded-xl bg-white/85 backdrop-blur-md border border-slate-100 shadow-md"
      >
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          {/* LEFT — Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => route("/")}
              className="flex items-center gap-3"
              aria-label="Go to home"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-white font-bold">
                C
              </div>
              <span className="hidden text-lg font-semibold text-slate-900 sm:block">
                CGPA Calculator
              </span>
            </button>
          </div>

          {/* CENTER — Nav links */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => route("/")}
              className="border-b-4 border-transparent px-1 pb-2 pt-2 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:text-slate-950"
            >
              Home
            </button>
            <button
              onClick={() => route("/gpa-calculate")}
              className="border-b-4 border-transparent px-1 pb-2 pt-2 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:text-slate-950"
            >
              Calculate
            </button>
            <button
              onClick={() => route("/dashboard")}
              className="border-b-4 border-blue-500 px-1 pb-2 pt-2 text-sm font-semibold text-slate-950"
            >
              Dashboard
            </button>
            <button className="relative border-b-4 border-transparent px-1 pb-2 pt-2 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:text-slate-950">
              Updates
              <span className="absolute -top-1 -right-1 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                3
              </span>
            </button>
          </nav>

          {/* RIGHT — Username + Logout */}
          <div className="flex items-center gap-3">
            <span className="hidden text-sm font-medium text-slate-700 sm:block">
              {user ? `${user.firstName} ${user.lastName}` : "Guest"}
            </span>
            <button
              onClick={() => {
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("token");
                localStorage.removeItem("currentUser");
                route("/login");
              }}
              className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
            <button
              className="md:hidden p-2 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile dropdown when hamburger is toggled */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed right-4 top-16 z-50 w-56 rounded-xl border border-slate-100 bg-white shadow-lg p-4"
          >
            <ul className="flex flex-col gap-3">
              <li><button onClick={() => { route("/"); setMenuOpen(false); }} className="text-left w-full text-sm text-slate-700 hover:text-blue-600">Home</button></li>
              <li><button onClick={() => { route("/gpa-calculate"); setMenuOpen(false); }} className="text-left w-full text-sm text-slate-700 hover:text-blue-600">Calculate</button></li>
              <li><button onClick={() => { route("/dashboard"); setMenuOpen(false); }} className="text-left w-full text-sm font-semibold text-slate-900">Dashboard</button></li>
              <li><button onClick={() => setMenuOpen(false)} className="relative text-left w-full text-sm text-slate-700 hover:text-blue-600">Updates</button></li>
              <li className="border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">
                    {user ? `${user.firstName} ${user.lastName}` : "Guest"}
                  </span>
                  <button
                    onClick={() => {
                      localStorage.removeItem("isLoggedIn");
                      localStorage.removeItem("token");
                      localStorage.removeItem("currentUser");
                      route("/login");
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-1.5 text-sm text-red-600"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dashboard Content */}
      <div className="flex flex-col items-center justify-center px-4 sm:px-6 pt-32 pb-10 w-full">
        <div className="w-full max-w-7xl space-y-6">
          {/* Compact Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
                Welcome back, {user ? user.firstName : "Musa"} 👋
              </h1>
              <p className="mt-1.5 text-sm text-slate-500">
                Track your academic performance and GPA progress.
              </p>
            </div>
            <div className="hidden sm:block">
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-blue-700 ring-1 ring-blue-100">
                <Sparkles className="h-3.5 w-3.5" /> Student Dashboard
              </span>
            </div>
          </motion.div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08, ease: "easeOut" }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm shadow-slate-200/50 ring-1 ring-slate-100 transition-shadow duration-300 hover:shadow-lg hover:shadow-slate-200/60"
              >
                <div className={`absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${s.gradient} opacity-[0.06] blur-2xl transition-opacity duration-300 group-hover:opacity-[0.14]`} />
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                      {s.value}
                    </p>
                    <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                      {s.label}
                    </p>
                  </div>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.iconBg}`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Second Row: Profile (35%) + Academic Progress (65%) */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              whileHover={{ y: -3 }}
              className="lg:col-span-2 flex flex-col rounded-3xl bg-white p-6 shadow-sm shadow-slate-200/50 ring-1 ring-slate-100 transition-shadow duration-300 hover:shadow-lg hover:shadow-slate-200/60"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 text-xl font-bold text-white shadow-md shadow-blue-500/25">
                  {user ? `${user.firstName?.[0] || "U"}${user.lastName?.[0] || ""}` : "U"}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">
                    {user ? `${user.firstName} ${user.lastName}` : "Student"}
                  </h3>
                  <p className="text-sm text-slate-500">{user?.email || "—"}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                {profileItems.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-xl bg-slate-50/60 px-3.5 py-2.5 ring-1 ring-slate-100"
                  >
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.color}`}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">{item.label}</p>
                      <p className="truncate text-sm font-medium text-slate-800">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => route("/dashboard")}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                <Pencil className="h-4 w-4" /> Edit Profile
              </button>
            </motion.div>

            {/* Academic Progress Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -3 }}
              className="lg:col-span-3 flex flex-col rounded-3xl bg-white p-6 shadow-sm shadow-slate-200/50 ring-1 ring-slate-100 transition-shadow duration-300 hover:shadow-lg hover:shadow-slate-200/60"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-950">Academic Progress</h3>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  <Calendar className="h-3.5 w-3.5" /> Semester Trend
                </span>
              </div>

              <div className="mt-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Current CGPA</p>
                  <p className="mt-1 text-4xl font-bold tracking-tight text-slate-950">
                    {currentCGPA !== null ? currentCGPA.toFixed(2) : "N/A"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Latest GPA</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-700">{latestGPA}</p>
                </div>
              </div>

              {/* Animated progress bar */}
              <div className="mt-5">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>0.00</span>
                  <span>5.00</span>
                </div>
                <div className="mt-1.5 h-3 w-full overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${currentCGPA !== null ? (currentCGPA / 5) * 100 : 0}%` }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                  />
                </div>
              </div>

              {/* Insight text */}
              <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-blue-50/70 px-4 py-3 ring-1 ring-blue-100">
                <TrendingUp className={`mt-0.5 h-4 w-4 shrink-0 ${improved ? "text-emerald-500" : "text-amber-500"}`} />
                <p className="text-sm text-slate-700">{insightText}</p>
              </div>

              {/* Tiny line chart placeholder */}
              <div className="mt-6">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  GPA Trend (last {trendData.length} semesters)
                </p>
                <div className="h-24 w-full overflow-hidden rounded-xl bg-slate-50/70 ring-1 ring-slate-100">
                  {trendData.length >= 2 ? (
                    <TrendChart data={trendData} />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-slate-400">
                      Add results to see your GPA trend here
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Third Row: Recent Results + Quick Actions Sidebar */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            {/* Recent Results Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="lg:col-span-4 rounded-3xl bg-white p-6 shadow-sm shadow-slate-200/50 ring-1 ring-slate-100"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">Recent Results</h3>
                  <p className="text-sm text-slate-500">All your saved academic records</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      value={search}
                      onInput={(e) => { setSearch((e.target as HTMLInputElement).value); setPage(1); }}
                      placeholder="Search semesters or courses..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 sm:w-52"
                    />
                  </div>
                  <select
                    value={semesterFilter}
                    onInput={(e) => { setSemesterFilter((e.target as HTMLSelectElement).value); setPage(1); }}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="all">All Semesters</option>
                    {semesters.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => setSortAsc((a) => !a)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                    title="Sort by GPA"
                  >
                    <ArrowUpDown className="h-4 w-4" /> {sortAsc ? "GPA ↑" : "GPA ↓"}
                  </button>
                </div>
              </div>

              {/* Table */}
              {sortedFiltered.length > 0 ? (
                <>
                  <div className="mt-5 overflow-x-auto">
                    <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                          <th className="pb-3 pr-3">Semester</th>
                          <th className="pb-3 pr-3">Courses</th>
                          <th className="pb-3 pr-3">Credits</th>
                          <th className="pb-3 pr-3">GPA</th>
                          <th className="pb-3 pr-3">CGPA</th>
                          <th className="pb-3 pr-3">Date</th>
                          <th className="pb-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {paginatedResults.map((result) => {
                          const credits = Array.isArray(result.courses)
                            ? result.courses.reduce((acc: number, c: any) => acc + (Number(c.units) || 0), 0)
                            : 0;
                          return (
                            <tr key={result._id} className="transition-colors hover:bg-slate-50/70">
                              <td className="py-3.5 pr-3 font-medium text-slate-800">{result.semester}</td>
                              <td className="py-3.5 pr-3 text-slate-500">
                                {Array.isArray(result.courses) ? result.courses.length : 0} courses
                              </td>
                              <td className="py-3.5 pr-3 text-slate-700">{credits}</td>
                              <td className="py-3.5 pr-3">
                                <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                                  {Number(result.gpa).toFixed(2)}
                                </span>
                              </td>
                              <td className="py-3.5 pr-3 font-medium text-slate-700">{Number(result.cgpa).toFixed(2)}</td>
                              <td className="py-3.5 pr-3 text-slate-500">{new Date(result.date).toLocaleDateString()}</td>
                              <td className="py-3.5 text-right">
                                <button
                                  onClick={() => setSelectedResult(result)}
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                                >
                                  <Eye className="h-3.5 w-3.5" /> View
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <p className="text-xs text-slate-500">
                      Showing <span className="font-semibold text-slate-700">{(safePage - 1) * pageSize + 1}</span>–
                      <span className="font-semibold text-slate-700">{Math.min(safePage * pageSize, sortedFiltered.length)}</span> of{" "}
                      <span className="font-semibold text-slate-700">{sortedFiltered.length}</span>
                    </p>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={safePage === 1}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <span className="px-2 text-sm font-medium text-slate-700">
                        {safePage} / {totalPages}
                      </span>
                      <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={safePage === totalPages}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-14 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-500 ring-1 ring-blue-100">
                    <BarChart3 className="h-8 w-8" />
                  </div>
                  <h4 className="mt-4 text-base font-semibold text-slate-800">No academic records yet</h4>
                  <p className="mt-1 max-w-xs text-sm text-slate-500">
                    Calculate your first GPA to see your results appear here.
                  </p>
                  <button
                    onClick={() => route("/gpa-calculate")}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700"
                  >
                    <Calculator className="h-4 w-4" /> Calculate GPA
                  </button>
                </div>
              )}
            </motion.div>

            {/* Quick Actions Sidebar */}
            <motion.aside
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-1 flex flex-col gap-4"
            >
              <div className="rounded-3xl bg-white p-5 shadow-sm shadow-slate-200/50 ring-1 ring-slate-100">
                <h3 className="text-sm font-semibold text-slate-900">Quick Actions</h3>
                <p className="mt-0.5 text-xs text-slate-400">Shortcuts</p>
                <div className="mt-4 flex flex-col gap-2.5">
                  {quickActions.map((a) => (
                    <motion.button
                      key={a.label}
                      whileTap={{ scale: 0.97 }}
                      onClick={a.action}
                      className={`inline-flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${a.color}`}
                    >
                      <a.icon className="h-4 w-4" /> {a.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Tips card */}
              <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 p-5 text-white shadow-lg shadow-blue-500/20">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h4 className="mt-3 text-sm font-semibold">Pro Tip</h4>
                <p className="mt-1 text-xs leading-relaxed text-blue-100">
                  Keep your results up to date to see accurate GPA trends and track your progress across semesters.
                </p>
              </div>
            </motion.aside>
          </div>

          {/* Feedback */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200/50 ring-1 ring-slate-100"
          >
            <h3 className="text-lg font-semibold text-slate-950">Feedback</h3>
            <p className="text-sm text-slate-500">Share your thoughts to help us improve.</p>
            <div className="mt-4">
              <FeedbackForm user={user} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showModal && selectedResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                <X className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-lg font-bold text-slate-900">Confirm Hide</h2>
              <p className="mt-2 text-sm text-slate-500">
                Are you sure you want to hide the result for{" "}
                <span className="font-semibold text-slate-700">{selectedResult.semester}</span>?
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  Hide
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Tiny SVG line/area chart placeholder (can later be swapped for Recharts)
const TrendChart = ({ data }: { data: any[] }) => {
  const width = 400;
  const height = 90;
  const max = Math.max(...data.map((d) => Number(d.gpa) || 0), 1);
  const min = Math.min(...data.map((d) => Number(d.gpa) || 0), 0);
  const range = max - min || 1;
  const stepX = width / (data.length - 1 || 1);

  const points = data.map((d, i) => {
    const x = i * stepX;
    const y = height - ((Number(d.gpa) - min) / range) * (height - 12) - 6;
    return [x, y];
  });

  const linePoints = points.map((p) => p.join(",")).join(" ");
  const areaPoints = `0,${height} ${linePoints} ${width},${height}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="h-full w-full">
      <defs>
        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill="url(#trendFill)" />
      <polyline
        points={linePoints}
        fill="none"
        stroke="#3b82f6"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
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
      const res = await api.addFeedback({ userId: user?._id, username: user?.username, message });
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
        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
        rows={4}
        placeholder="Share your thoughts about the app..."
        value={message}
        onInput={(e) => setMessage((e.target as HTMLTextAreaElement).value)}
        required
        disabled={loading}
      />
      <div className="flex items-center gap-4">
        <button
          type="submit"
          className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
        {success && <p className="text-sm text-emerald-600">{success}</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </form>
  );
};

export default Dashboard;
