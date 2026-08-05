import { useState } from "preact/hooks";
import { route } from "preact-router";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut } from "lucide-react";

interface UserNavbarProps {
  user?: any;
  isLoggedIn?: boolean;
}

const UserNavbar = ({ user, isLoggedIn }: UserNavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const currentUser = user || (() => {
    try {
      const raw = localStorage.getItem("currentUser");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const loggedIn = isLoggedIn !== undefined ? isLoggedIn : localStorage.getItem("isLoggedIn") === "true";

  // Automatically detect the active page from the current pathname
  const path = typeof window !== "undefined" ? window.location.pathname : "/";
  const active: "home" | "calculate" | "dashboard" =
    path === "/" || path === "/home"
      ? "home"
      : path.startsWith("/gpa-calculate")
      ? "calculate"
      : path.startsWith("/dashboard")
      ? "dashboard"
      : "home";

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    route("/login");
  };

  return (
    <>
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

{/* CENTER — Nav links (pushed to the right for guests, centered for authenticated users) */}
          <nav className={`hidden md:flex items-center gap-8 ${!loggedIn ? "md:ml-auto" : ""}`}>
            <button
              onClick={() => route("/")}
              className={`border-b-4 px-1 pb-2 pt-2 text-sm font-semibold transition ${
                active === "home"
                  ? "border-blue-500 text-slate-950"
                  : "border-transparent text-slate-600 hover:border-blue-200 hover:text-slate-950"
              }`}
            >
              Home
            </button>
            {loggedIn ? (
              <>
                <button
                  onClick={() => route("/gpa-calculate")}
                  className={`border-b-4 px-1 pb-2 pt-2 text-sm font-semibold transition ${
                    active === "calculate"
                      ? "border-blue-500 text-slate-950"
                      : "border-transparent text-slate-600 hover:border-blue-200 hover:text-slate-950"
                  }`}
                >
                  Calculate
                </button>
                <button
                  onClick={() => route("/dashboard")}
                  className={`border-b-4 px-1 pb-2 pt-2 text-sm font-semibold transition ${
                    active === "dashboard"
                      ? "border-blue-500 text-slate-950"
                      : "border-transparent text-slate-600 hover:border-blue-200 hover:text-slate-950"
                  }`}
                >
                  Dashboard
                </button>
                <button className="relative border-b-4 border-transparent px-1 pb-2 pt-2 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:text-slate-950">
                  Updates
                  <span className="absolute -top-1 -right-1 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                    3
                  </span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => route("/login")}
                  className="border-b-4 border-transparent px-1 pb-2 pt-2 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:text-slate-950"
                >
                  Login
                </button>
                <button
                  onClick={() => route("/signup")}
                  className="border-b-4 border-transparent px-1 pb-2 pt-2 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:text-slate-950"
                >
                  Sign up
                </button>
              </>
            )}
          </nav>

          {/* RIGHT — Username + Logout */}
          <div className="flex items-center gap-3">
            {loggedIn ? (
              <>
                <span className="hidden text-sm font-medium text-slate-700 sm:block">
                  {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Guest"}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
                  aria-label="Logout"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : null}
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
              <li><button onClick={() => { route("/"); setMenuOpen(false); }} className={`text-left w-full text-sm ${active === "home" ? "font-semibold text-slate-900" : "text-slate-700 hover:text-blue-600"}`}>Home</button></li>
              {loggedIn ? (
                <>
                  <li><button onClick={() => { route("/gpa-calculate"); setMenuOpen(false); }} className={`text-left w-full text-sm ${active === "calculate" ? "font-semibold text-slate-900" : "text-slate-700 hover:text-blue-600"}`}>Calculate</button></li>
                  <li><button onClick={() => { route("/dashboard"); setMenuOpen(false); }} className={`text-left w-full text-sm ${active === "dashboard" ? "font-semibold text-slate-900" : "text-slate-700 hover:text-blue-600"}`}>Dashboard</button></li>
                  <li><button onClick={() => setMenuOpen(false)} className="relative text-left w-full text-sm text-slate-700 hover:text-blue-600">Updates</button></li>
                  <li className="border-t border-slate-100 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">
                        {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Guest"}
                      </span>
                      <button
                        onClick={() => {
                          logout();
                          setMenuOpen(false);
                        }}
                        className="flex items-center gap-1.5 text-sm text-red-600"
                      >
                        <LogOut className="h-4 w-4" /> Logout
                      </button>
                    </div>
                  </li>
                </>
              ) : (
                <>
                  <li><button onClick={() => { route("/login"); setMenuOpen(false); }} className="text-left w-full text-sm text-slate-700 hover:text-blue-600">Login</button></li>
                  <li><button onClick={() => { route("/signup"); setMenuOpen(false); }} className="text-left w-full text-sm text-slate-700 hover:text-blue-600">Sign up</button></li>
                </>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default UserNavbar;
