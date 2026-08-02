import type { FunctionalComponent } from "preact";
import type { RoutableProps } from "preact-router";
import { useState } from "preact/hooks";
import { route } from "preact-router";

const AdminLogin: FunctionalComponent<RoutableProps> = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await response.json();

      if (response.ok && data.role === 'admin') {
        localStorage.setItem("token", data.token);
        localStorage.setItem("currentUser", JSON.stringify(data));
        localStorage.setItem("isLoggedIn", "true");
        route("/admin-dashboard");
      } else {
        alert("Invalid email or password ❌");
      }
    } catch (error) {
      alert("Network error. Please try again.");
    }
  };

  return (
  <div className="min-h-screen flex flex-col items-center bg-white px-2 sm:px-0 overflow-hidden text-slate-900">
      {/* Navbar */}
      <nav className="flex w-full flex-col sm:flex-row items-center px-4 sm:px-8 py-4 bg-white border-b border-slate-200 shadow-sm relative">
        <div className="flex w-full justify-between items-center">
          <a href="/" class="text-xl font-bold text-slate-950">CGPA Calculator</a>
          <button
            className="sm:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        <div
          className={`flex-col sm:flex-row gap-2 sm:gap-4 items-center justify-end w-screen sm:w-screen sm:flex ${
            menuOpen ? "flex" : "hidden"
          } sm:!flex bg-white sm:bg-transparent absolute sm:static left-0 top-full sm:top-auto z-10 sm:z-auto p-4 sm:p-0 border-b border-slate-200 sm:border-b-0`}
        >
          <a href="/" className="text-slate-600 hover:text-blue-700 text-sm">Home</a>
          <a
            href="/signup"
            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 w-full sm:w-auto text-center"
          >
            Sign up
          </a>
          <a
            href="/admin"
            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 w-full sm:w-auto text-center"
          >
            Admin
          </a>
        </div>
      </nav>

      {/* Login Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border mt-18 border-slate-200 p-4 mb-3.5 sm:p-6 rounded-lg shadow-sm w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl h-auto"
        style={{ minWidth: 0 }}
      >
        <h2 className="text-xl sm:text-2xl font-bold text-slate-950 mb-6 text-center">
          Admin Login
        </h2>

  <div className="grid grid-cols-1 gap-4 mb-4 w-full">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
            className="w-full p-3 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
            className="w-full p-3 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full mt-4 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
