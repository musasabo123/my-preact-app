import { useState } from "preact/hooks";
import { route } from "preact-router";
import { Home, Calculator, LogOut, LogIn, BarChart3, Menu } from "lucide-react";

const AdminSidebar = () => {
  const [open, setOpen] = useState(false);
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  return (
    <>
      <header className="fixed left-0 top-0 z-50 flex w-full items-center justify-between border-b border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm">
        <button
          className="rounded-md p-2 text-slate-600 hover:bg-slate-100"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold">GPA Tracker</h1>
        <div className="w-6" />
      </header>

      <div
        className={`fixed left-0 top-0 z-40 h-full w-64 transform border-r border-slate-200 bg-white pt-16 text-slate-900 shadow-xl transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="flex-1 space-y-3 px-4 py-6">
          <button onClick={() => route("/")} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-100">
            <Home className="h-5 w-5" />
            Home
          </button>

          <button onClick={() => route("/gpa-calculate")} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-100">
            <Calculator className="h-5 w-5" />
            Calculate GPA
          </button>

          <button onClick={() => route("/dashboard")} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-100">
            <BarChart3 className="h-5 w-5" />
            Dashboard
          </button>

          {isLoggedIn ? (
            <button
              onClick={() => {
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("token");
                localStorage.removeItem("currentUser");
                route("/login");
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          ) : (
            <button onClick={() => route("/login")} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-green-700 hover:bg-green-50">
              <LogIn className="h-5 w-5" />
              Login
            </button>
          )}
        </nav>
      </div>

      {open && <div className="fixed inset-0 z-30 bg-slate-900/25" onClick={() => setOpen(false)} />}
    </>
  );
};

export default AdminSidebar;
