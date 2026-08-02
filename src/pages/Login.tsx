import type { FunctionalComponent } from "preact";
import type { RoutableProps } from "preact-router";
import { useState } from "preact/hooks";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

const Login: FunctionalComponent<RoutableProps> = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("currentUser", JSON.stringify(data));
        localStorage.setItem("isLoggedIn", "true");

        if (data.role && data.role === "admin") {
          window.location.href = "/admin-dashboard";
        } else {
          window.location.href = "/dashboard";
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-slate-100 px-2 sm:px-0 overflow-hidden text-slate-900">
      <main className="flex min-h-screen flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:px-8 w-full">
        <div className="relative w-full max-w-3xl rounded-[28px] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-[0_40px_120px_-60px_rgba(15,23,42,0.25)] sm:p-10">
          <a
            href="/"
            aria-label="Go back home"
            className="absolute left-6 top-6 z-10 inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-950 shadow-lg shadow-slate-200/70 transition hover:-translate-x-0.5 hover:border-slate-300 hover:bg-slate-50"
          >
            <ArrowLeft size={24} strokeWidth={3} />
          </a>
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded-3xl bg-slate-50 p-6 shadow-xl shadow-slate-200/60">
              <div className="h-full min-h-[26rem] overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-br from-slate-100 via-slate-50 to-white shadow-inner">
                <div className="flex h-full flex-col justify-between gap-6 p-6 pt-20">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-blue-500">Sign in to your account</p>
                    <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">Welcome back.</h1>
                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      Access your GPA dashboard and continue tracking your academic performance securely.
                    </p>
                  </div>

                  <svg viewBox="0 0 560 420" className="h-full min-h-[17rem] w-full" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="loginCgpaTitle">
                    <title id="loginCgpaTitle">Secure CGPA dashboard preview</title>
                    <defs>
                      <linearGradient id="loginCgpaBg" x1="54" y1="26" x2="506" y2="394" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#e0f2fe" />
                        <stop offset="0.52" stopColor="#f8fafc" />
                        <stop offset="1" stopColor="#dcfce7" />
                      </linearGradient>
                      <linearGradient id="loginCgpaHeader" x1="96" y1="78" x2="430" y2="270" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#2563eb" />
                        <stop offset="1" stopColor="#0f766e" />
                      </linearGradient>
                      <filter id="loginCgpaShadow" x="42" y="34" width="476" height="356" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feDropShadow dx="0" dy="18" stdDeviation="18" floodColor="#0f172a" floodOpacity="0.14" />
                      </filter>
                    </defs>

                    <rect x="24" y="20" width="512" height="380" rx="42" fill="url(#loginCgpaBg)" />
                    <circle cx="92" cy="94" r="36" fill="#bfdbfe" opacity="0.8" />
                    <circle cx="480" cy="326" r="48" fill="#bbf7d0" opacity="0.76" />
                    <path d="M74 320C132 274 174 290 220 318C267 346 315 346 368 304C418 265 462 274 508 302" stroke="#dbeafe" strokeWidth="16" strokeLinecap="round" />

                    <g filter="url(#loginCgpaShadow)">
                      <rect x="84" y="62" width="392" height="276" rx="32" fill="#ffffff" />
                      <rect x="108" y="88" width="344" height="72" rx="24" fill="url(#loginCgpaHeader)" />
                      <text x="132" y="122" fill="#ffffff" fontSize="18" fontWeight="700" fontFamily="Inter, Arial, sans-serif">CGPA Dashboard</text>
                      <text x="132" y="145" fill="#dbeafe" fontSize="12" fontFamily="Inter, Arial, sans-serif">Welcome back to your semester overview</text>
                      <rect x="354" y="102" width="72" height="34" rx="17" fill="#ffffff" fillOpacity="0.18" />
                      <text x="373" y="125" fill="#ffffff" fontSize="16" fontWeight="700" fontFamily="Inter, Arial, sans-serif">4.62</text>

                      <rect x="110" y="184" width="96" height="70" rx="18" fill="#eff6ff" />
                      <text x="130" y="213" fill="#1d4ed8" fontSize="13" fontWeight="700" fontFamily="Inter, Arial, sans-serif">Current</text>
                      <text x="130" y="237" fill="#0f172a" fontSize="25" fontWeight="800" fontFamily="Inter, Arial, sans-serif">4.62</text>

                      <rect x="232" y="184" width="96" height="70" rx="18" fill="#f0fdf4" />
                      <text x="252" y="213" fill="#047857" fontSize="13" fontWeight="700" fontFamily="Inter, Arial, sans-serif">Courses</text>
                      <text x="253" y="237" fill="#0f172a" fontSize="25" fontWeight="800" fontFamily="Inter, Arial, sans-serif">9</text>

                      <rect x="354" y="184" width="96" height="70" rx="18" fill="#fff7ed" />
                      <text x="374" y="213" fill="#c2410c" fontSize="13" fontWeight="700" fontFamily="Inter, Arial, sans-serif">Units</text>
                      <text x="374" y="237" fill="#0f172a" fontSize="25" fontWeight="800" fontFamily="Inter, Arial, sans-serif">21</text>

                      <rect x="110" y="278" width="204" height="34" rx="17" fill="#f8fafc" />
                      <rect x="126" y="293" width="84" height="5" rx="2.5" fill="#93c5fd" />
                      <rect x="222" y="293" width="40" height="5" rx="2.5" fill="#86efac" />
                      <rect x="274" y="293" width="24" height="5" rx="2.5" fill="#fdba74" />

                      <rect x="342" y="272" width="94" height="58" rx="19" fill="#0f172a" />
                      <path d="M367 296V286C367 274 376 266 389 266C402 266 411 274 411 286V296" stroke="#93c5fd" strokeWidth="8" strokeLinecap="round" />
                      <rect x="360" y="292" width="58" height="32" rx="12" fill="#dbeafe" />
                      <circle cx="389" cy="308" r="5" fill="#2563eb" />
                    </g>

                    <g>
                      <rect x="54" y="238" width="104" height="86" rx="24" fill="#1e293b" />
                      <rect x="74" y="256" width="64" height="18" rx="9" fill="#dbeafe" />
                      <circle cx="84" cy="292" r="7" fill="#60a5fa" />
                      <circle cx="108" cy="292" r="7" fill="#60a5fa" />
                      <circle cx="132" cy="292" r="7" fill="#60a5fa" />
                      <rect x="78" y="308" width="58" height="6" rx="3" fill="#94a3b8" />
                    </g>
                  </svg>
                </div>
              </div>
            </section>

            <div className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/80">
              <h2 className="text-2xl font-semibold text-slate-950">Sign in</h2>
              <p className="mt-2 text-sm text-slate-500">Enter your username or email and password to continue.</p>

              {error && (
                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <label className="block text-sm font-medium text-slate-700">
                  Username or Email
                  <input
                    type="text"
                    placeholder="Enter your username or email"
                    value={username}
                    onInput={(e) => setUsername((e.target as HTMLInputElement).value)}
                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </label>

                <label className="block text-sm font-medium text-slate-700">
                  Password
                  <div className="relative mt-2">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
                      className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 pr-12 text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-4 flex items-center text-slate-500 transition hover:text-slate-900"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </label>

                <div className="flex items-center justify-between text-sm text-slate-500">
                  <a href="/signup" className="font-medium text-blue-600 hover:text-blue-700">
                    Create account
                  </a>
                  <a href="/forgot-password" className="font-medium text-slate-600 hover:text-slate-900">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Sign in
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      
    </div>
  );
};

export default Login;
