import type { FunctionalComponent } from "preact"; 
import type { RoutableProps } from "preact-router";
import { useState } from "preact/hooks";
import { api } from "../utils/api";

const Signup: FunctionalComponent<RoutableProps> = () => {
  // State for all form data
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    username: "",
    gender: "",
    password: "",
    level: "",
    department: "",
    university: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [strength, setStrength] = useState("");
  const [agree, setAgree] = useState(false);

  // State for showing messages
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  // Generic change handler
  const handleChange = (e: any) => {
    const t = e.target as HTMLInputElement | HTMLSelectElement;
    setForm({ ...form, [t.name]: t.value });
  };

  const handlePassword = (val: string) => {
    setForm({ ...form, password: val });
    if (val.length < 6) setStrength("Weak ❌");
    else if (val.length < 10) setStrength("Medium ⚠️");
    else setStrength("Strong ✅");
  };

  const clearForm = () => {
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      username: "",
      gender: "",
      password: "",
      level: "",
      department: "",
      university: "",
    });
    setConfirmPassword("");
    setStrength("");
    setAgree(false);
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    // Reset message
    setMessage(null);

    if (!agree) {
      setMessage({ type: "error", text: "You must agree to the terms before creating an account." });
      return;
    }

    if (form.password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match!" });
      return;
    }

    try {
      const response = await api.register(form);

      const data = await response.json();

      if (response.ok) {
        // ✅ Use backend message instead of hardcoding
        setMessage({ type: "success", text: data.message || "Account created successfully!" });

        clearForm();

        // Redirect after 2 seconds
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
      } else {
        setMessage({ type: "error", text: data.message || "Registration failed" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error. Please try again." });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white px-2 sm:px-0 overflow-hidden text-slate-900">
      <nav className="flex w-full items-center justify-between px-6 py-5 bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <a href="/" className="text-xl font-semibold tracking-tight text-slate-950">
          CGPA Calculator
        </a>
        <div className="flex items-center gap-5 sm:gap-8">
          <a href="/" className="border-b-4 border-transparent px-1 pb-2 pt-2 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:text-slate-950">
            Home
          </a>
          <a
            href="/login"
            className="border-b-4 border-transparent px-1 pb-2 pt-2 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:text-slate-950"
          >
            Login
          </a>
          <a href="/signup" className="border-b-4 border-blue-500 px-1 pb-2 pt-2 text-sm font-semibold text-slate-950">
            Sign up
          </a>
        </div>
      </nav>

      <main className="flex flex-1 items-center justify-center px-4 py-6 sm:px-6 lg:px-8 w-full">
        <div className="w-full max-w-5xl rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.12)] sm:p-6">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_0.65fr] items-start">
            <div className="rounded-3xl bg-slate-50 p-6 shadow-xl shadow-slate-200/60">
              <div className="h-full min-h-[26rem] overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-br from-slate-100 via-slate-50 to-white shadow-inner">
                <div className="flex h-full items-center justify-center p-6">
                  <svg viewBox="0 0 560 420" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="signupCgpaTitle">
                    <title id="signupCgpaTitle">CGPA calculator dashboard preview</title>
                    <defs>
                      <linearGradient id="signupCgpaBg" x1="62" y1="28" x2="498" y2="392" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#eef6ff" />
                        <stop offset="0.55" stopColor="#f8fafc" />
                        <stop offset="1" stopColor="#ecfdf5" />
                      </linearGradient>
                      <linearGradient id="signupCgpaCard" x1="95" y1="72" x2="444" y2="326" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#2563eb" />
                        <stop offset="1" stopColor="#0f766e" />
                      </linearGradient>
                      <filter id="signupCgpaShadow" x="44" y="35" width="472" height="354" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feDropShadow dx="0" dy="18" stdDeviation="18" floodColor="#0f172a" floodOpacity="0.14" />
                      </filter>
                    </defs>

                    <rect x="24" y="20" width="512" height="380" rx="42" fill="url(#signupCgpaBg)" />
                    <circle cx="104" cy="90" r="34" fill="#bfdbfe" opacity="0.75" />
                    <circle cx="482" cy="330" r="46" fill="#bbf7d0" opacity="0.72" />
                    <path d="M76 318C132 280 168 286 214 314C259 342 308 348 366 306C418 268 462 272 508 300" stroke="#dbeafe" strokeWidth="16" strokeLinecap="round" />

                    <g filter="url(#signupCgpaShadow)">
                      <rect x="84" y="62" width="392" height="276" rx="32" fill="#ffffff" />
                      <rect x="108" y="88" width="344" height="72" rx="24" fill="url(#signupCgpaCard)" />
                      <text x="132" y="122" fill="#ffffff" fontSize="18" fontWeight="700" fontFamily="Inter, Arial, sans-serif">CGPA Calculator</text>
                      <text x="132" y="145" fill="#dbeafe" fontSize="12" fontFamily="Inter, Arial, sans-serif">Track grades, units, and semester performance</text>
                      <rect x="352" y="104" width="74" height="32" rx="16" fill="#ffffff" fillOpacity="0.18" />
                      <text x="371" y="126" fill="#ffffff" fontSize="16" fontWeight="700" fontFamily="Inter, Arial, sans-serif">4.62</text>

                      <rect x="110" y="184" width="94" height="68" rx="18" fill="#eff6ff" />
                      <text x="129" y="213" fill="#1d4ed8" fontSize="13" fontWeight="700" fontFamily="Inter, Arial, sans-serif">CSC 201</text>
                      <text x="130" y="235" fill="#0f172a" fontSize="24" fontWeight="800" fontFamily="Inter, Arial, sans-serif">A</text>
                      <text x="166" y="234" fill="#64748b" fontSize="12" fontFamily="Inter, Arial, sans-serif">3 units</text>

                      <rect x="226" y="184" width="94" height="68" rx="18" fill="#f0fdf4" />
                      <text x="245" y="213" fill="#047857" fontSize="13" fontWeight="700" fontFamily="Inter, Arial, sans-serif">MTH 202</text>
                      <text x="246" y="235" fill="#0f172a" fontSize="24" fontWeight="800" fontFamily="Inter, Arial, sans-serif">B+</text>
                      <text x="286" y="234" fill="#64748b" fontSize="12" fontFamily="Inter, Arial, sans-serif">2 units</text>

                      <rect x="342" y="184" width="94" height="68" rx="18" fill="#fff7ed" />
                      <text x="361" y="213" fill="#c2410c" fontSize="13" fontWeight="700" fontFamily="Inter, Arial, sans-serif">GST 211</text>
                      <text x="362" y="235" fill="#0f172a" fontSize="24" fontWeight="800" fontFamily="Inter, Arial, sans-serif">A-</text>
                      <text x="402" y="234" fill="#64748b" fontSize="12" fontFamily="Inter, Arial, sans-serif">1 unit</text>

                      <rect x="110" y="276" width="196" height="34" rx="17" fill="#f8fafc" />
                      <rect x="126" y="291" width="78" height="5" rx="2.5" fill="#93c5fd" />
                      <rect x="216" y="291" width="34" height="5" rx="2.5" fill="#86efac" />
                      <rect x="262" y="291" width="26" height="5" rx="2.5" fill="#fdba74" />

                      <rect x="330" y="274" width="106" height="56" rx="18" fill="#0f172a" />
                      <circle cx="354" cy="294" r="7" fill="#60a5fa" />
                      <circle cx="380" cy="294" r="7" fill="#34d399" />
                      <circle cx="406" cy="294" r="7" fill="#f59e0b" />
                      <rect x="350" y="312" width="60" height="6" rx="3" fill="#e2e8f0" />
                    </g>

                    <g>
                      <rect x="54" y="238" width="104" height="86" rx="24" fill="#1e293b" />
                      <rect x="74" y="256" width="64" height="18" rx="9" fill="#dbeafe" />
                      <circle cx="84" cy="292" r="7" fill="#60a5fa" />
                      <circle cx="108" cy="292" r="7" fill="#60a5fa" />
                      <circle cx="132" cy="292" r="7" fill="#60a5fa" />
                      <rect x="78" y="308" width="58" height="6" rx="3" fill="#94a3b8" />
                    </g>

                    <g>
                      <rect x="416" y="38" width="74" height="74" rx="24" fill="#ffffff" />
                      <path d="M435 78L448 91L475 57" stroke="#16a34a" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                  </svg>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/80">
              <div className="mb-4">
                <h2 className="text-2xl font-semibold text-slate-950">Sign up</h2>
                <p className="mt-2 text-sm text-slate-500">Enter your details to create your account.</p>
              </div>

              {message && (
                <div
                  className={`mt-6 rounded-2xl px-4 py-3 text-sm border ${
                    message.type === "error" ? "bg-red-50 text-red-700 border-red-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"
                  }`}
                  role="status"
                >
                  <div className="flex items-start justify-between gap-4">
                    <p>{message.text}</p>
                    <button
                      type="button"
                      onClick={() => setMessage(null)}
                      className="text-slate-500 hover:text-slate-700"
                    >
                      ✖
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <label className="block text-sm font-medium text-slate-700">
                    First Name
                    <input
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onInput={handleChange}
                      placeholder="First"
                      className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      required
                    />
                  </label>
                  <label className="block text-sm font-medium text-slate-700">
                    Last Name
                    <input
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onInput={handleChange}
                      placeholder="Last"
                      className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      required
                    />
                  </label>
                </div>

                <label className="block text-sm font-medium text-slate-700">
                  Email
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onInput={handleChange}
                    placeholder="you@example.com"
                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </label>

                <label className="block text-sm font-medium text-slate-700">
                  Username
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onInput={handleChange}
                    placeholder="username"
                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <label className="block text-sm font-medium text-slate-700">
                    Phone
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={form.phoneNumber}
                      onInput={handleChange}
                      pattern="[0-9]{10,15}"
                      className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      required
                    />
                  </label>
                  <label className="block text-sm font-medium text-slate-700">
                    Gender
                    <select
                      name="gender"
                      value={form.gender}
                      onInput={handleChange}
                      className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      required
                    >
                      <option value="" disabled>Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </label>
                </div>

                <label className="block text-sm font-medium text-slate-700">
                  Password
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onInput={(e) => handlePassword((e.target as HTMLInputElement).value)}
                    placeholder="••••••••"
                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                  {form.password && (
                    <p className={`mt-1 text-xs font-medium ${strength.includes("Weak") ? "text-red-500" : strength.includes("Medium") ? "text-amber-500" : "text-emerald-500"}`}>
                      {strength}
                    </p>
                  )}
                </label>

                <label className="block text-sm font-medium text-slate-700">
                  Confirm Password
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onInput={(e) => setConfirmPassword((e.target as HTMLInputElement).value)}
                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                  {confirmPassword && confirmPassword === form.password && (
                    <p className="mt-1 text-xs font-medium text-emerald-500">✓ Match</p>
                  )}
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <label className="block text-sm font-medium text-slate-700">
                    Level
                    <select
                      name="level"
                      value={form.level}
                      onInput={handleChange}
                      className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      required
                    >
                      <option value="">Select</option>
                      <option>100L</option>
                      <option>200L</option>
                      <option>300L</option>
                      <option>400L</option>
                      <option>500L</option>
                    </select>
                  </label>
                  <label className="block text-sm font-medium text-slate-700">
                    Department
                    <input
                      type="text"
                      name="department"
                      value={form.department}
                      onInput={handleChange}
                      placeholder="Dept"
                      className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      required
                    />
                  </label>
                </div>

                <label className="block text-sm font-medium text-slate-700">
                  University
                  <select
                    name="university"
                    value={form.university}
                    onInput={handleChange}
                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
                  >
                    <option value="">Select University</option>
                    <option>University of Lagos</option>
                    <option>Ahmadu Bello University</option>
                    <option>University of Ibadan</option>
                    <option>Nile University</option>
                  </select>
                </label>

                <label className="flex items-center gap-3 text-sm font-medium text-slate-700 mt-4">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.currentTarget.checked)}
                    className="h-5 w-5 rounded border-slate-300 text-blue-600 cursor-pointer"
                  />
                  <span>
                    I agree to the <a href="#" className="font-medium text-blue-600 hover:underline">Terms & Conditions</a>
                  </span>
                </label>

                <button
                  type="submit"
                  className="w-full mt-5 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Create account
                </button>
              </form>

              
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Signup;
