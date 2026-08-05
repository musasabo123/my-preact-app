import type { FunctionalComponent } from "preact";
import type { RoutableProps } from "preact-router";
import { useState, useEffect } from "preact/hooks";
import { route } from "preact-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Shield,
  UserCheck,
  ClipboardList,
  LayoutDashboard,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  Moon,
  Sun,
  Bell,
  UserCircle,
} from "lucide-react";
import { api } from "../utils/api";

const AdminDashboard: FunctionalComponent<RoutableProps> = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);

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
        const response = await api.getAllUsers(token);

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
        const res = await api.getAllFeedback();
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

  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser") || "{}");
    } catch {
      return {};
    }
  })();

  const adminName = currentUser?.firstName
    ? `${currentUser.firstName} ${currentUser.lastName || ""}`
    : "Administrator";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    route("/login");
  };

const navItems = [
    { label: "Dashboard", id: "dashboard", icon: LayoutDashboard },
    { label: "Users", id: "users", icon: Users },
    { label: "Feedback", id: "feedback", icon: MessageSquare },
    { label: "Settings", id: "settings", icon: Settings },
  ];

  // Toggle dark mode class on the root element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Smooth scroll to a section
  const scrollToSection = (id: string) => {
    if (id === "dashboard") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    setSidebarOpen(false);
  };

  // Intersection Observer to highlight the active section while scrolling
  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar (desktop + tablet) */}
      <aside className="fixed left-0 top-0 z-50 hidden h-screen flex-col border-r border-slate-200 bg-white shadow-lg shadow-slate-200/40 md:flex lg:w-[260px] md:w-[72px]">
        {/* Top: Logo + Admin Dashboard */}
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5 lg:px-5 md:px-4 md:justify-center lg:justify-start">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white font-bold">
            C
          </div>
          <span className="hidden text-lg font-semibold text-slate-900 lg:block">
            Admin Dashboard
          </span>
        </div>

{/* Navigation */}
        <nav className="flex-1 space-y-1.5 px-3 py-5 lg:px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <motion.button
                key={item.label}
                onClick={() => scrollToSection(item.id)}
                title={item.label}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                } md:justify-center lg:justify-start`}
              >
                <Icon className={`h-5 w-5 shrink-0 transition-colors ${isActive ? "text-white" : "text-slate-400 group-hover:text-blue-500"}`} />
                <span className="hidden lg:block">{item.label}</span>
              </motion.button>
            );
          })}
        </nav>

        {/* Bottom: Admin profile + logout */}
        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 md:justify-center lg:justify-start">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-sm font-bold text-white">
              {currentUser?.firstName?.[0] || "A"}
            </div>
            <div className="hidden min-w-0 lg:block">
              <p className="truncate text-sm font-semibold text-slate-900">{adminName}</p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100 md:px-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden lg:block">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed left-0 top-0 z-40 flex h-14 w-full items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-white font-bold">
            C
          </div>
          <span className="text-base font-semibold text-slate-900">Admin Dashboard</span>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 z-50 flex h-screen w-[260px] flex-col border-r border-slate-200 bg-white shadow-xl md:hidden"
            >
              <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white font-bold">
                  C
                </div>
                <span className="text-lg font-semibold text-slate-900">Admin Dashboard</span>
              </div>

<nav className="flex-1 space-y-1.5 px-4 py-5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <motion.button
                      key={item.label}
                      onClick={() => scrollToSection(item.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <Icon className={`h-5 w-5 shrink-0 transition-colors ${isActive ? "text-white" : "text-slate-400"}`} />
                      <span>{item.label}</span>
                    </motion.button>
                  );
                })}
              </nav>

              <div className="border-t border-slate-100 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-sm font-bold text-white">
                    {currentUser?.firstName?.[0] || "A"}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{adminName}</p>
                    <p className="text-xs text-slate-500">Administrator</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

{/* Main Content */}
      <div className="flex min-h-screen w-full flex-col bg-slate-50 md:pl-[72px] lg:pl-[260px]">
        <div className="px-4 sm:px-6 py-4 pt-20 md:pt-6">
          <div className="max-w-5xl mx-auto space-y-4">
            {/* Dashboard Section */}
            <section id="dashboard" className="scroll-mt-20 space-y-4">
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
            </section>

            {/* Two-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Recent Users */}
              <section id="users" className="scroll-mt-20 rounded-2xl bg-white p-4 border border-slate-200 shadow-sm">
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
              </section>

              {/* Recent Feedback */}
              <section id="feedback" className="scroll-mt-20 rounded-2xl bg-white p-4 border border-slate-200 shadow-sm">
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
              </section>
            </div>

            {/* Settings Section */}
            <section id="settings" className="scroll-mt-20 space-y-4">
              <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-950 mb-1">Settings</h2>
                <p className="text-slate-600">Manage your admin preferences.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Dark Mode Toggle */}
                <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                      {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Dark Mode</p>
                      <p className="text-xs text-slate-500">{darkMode ? "Enabled" : "Disabled"}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setDarkMode((prev) => !prev)}
                    className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${darkMode ? "bg-blue-600" : "bg-slate-300"}`}
                    aria-label="Toggle dark mode"
                  >
                    <motion.span
                      layout
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow ${darkMode ? "left-[22px]" : "left-0.5"}`}
                    />
                  </button>
                </div>

                {/* Admin Profile */}
                <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <UserCircle className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">Admin Profile</p>
                    <p className="text-xs text-slate-500 truncate">{adminName}</p>
                  </div>
                </div>

                {/* Notifications (placeholder) */}
                <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <Bell className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Notifications</p>
                    <p className="text-xs text-slate-500">Coming soon</p>
                  </div>
                </div>

                {/* Logout */}
                <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                    <LogOut className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">Logout</p>
                    <p className="text-xs text-slate-500">Sign out of the admin panel</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
