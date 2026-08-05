import type { FunctionalComponent } from "preact";
import type { RoutableProps } from "preact-router";
import { useState, useEffect } from "preact/hooks";
import { FaInstagram, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { route } from "preact-router";
import UserNavbar from "../components/layout/UserNavbar";

const Home: FunctionalComponent<RoutableProps> = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(loggedIn && !!token);
    };
    
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 text-slate-900">
      <UserNavbar active="home" isLoggedIn={isLoggedIn} />

      <main className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-8 md:px-12">
        <div className="relative overflow-hidden rounded-[2rem] border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-blue-100 p-8 shadow-[0_20px_60px_-20px_rgba(2,6,23,0.08)] sm:p-12">
          <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-r from-blue-200/30 via-transparent to-transparent opacity-80 blur-3xl" />
          <div className="relative text-center md:text-left">
            <span className="inline-flex rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.12em] text-blue-700 ring-1 ring-blue-100">
              Academic performance made clear
            </span>
            <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              CGPA Calculator
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700 sm:text-xl">
              Easily calculate your GPA on a 5.0 scale. Track courses, save results, and understand your progress with a calm, confident workflow.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-start">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => route("/gpacalculate")}
                    className="inline-flex items-center justify-center rounded-full bg-blue-500 px-8 py-4 text-base font-semibold text-white shadow-md shadow-blue-200/40 transition hover:bg-blue-400"
                  >
                    Start calculating
                  </button>
                  <button
                    onClick={() => route("/dashboard")}
                    className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-white px-8 py-4 text-base font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-50"
                  >
                    View dashboard
                  </button>
                </>
              ) : (
                <>
                  <a
                    href="/signup"
                    className="inline-flex items-center justify-center rounded-full bg-blue-500 px-8 py-4 text-base font-semibold text-white shadow-md shadow-blue-200/40 transition hover:bg-blue-400"
                  >
                    Get started
                  </a>
                  <button
                    onClick={() => route("/login")}
                    className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-white px-8 py-4 text-base font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-50"
                  >
                    Login to calculate
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Fast results", value: "Compute scores instantly" },
              { label: "Secure saving", value: "Save sessions for later" },
              { label: "Clear reports", value: "Readable, professional output" },
            ].map((item) => (
              <div key={item.label} className="rounded-3xl border border-slate-100 bg-white p-4 text-left shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">{item.label}</p>
                <p className="mt-2 text-base font-medium text-slate-900">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-8">
        <div className="mb-8">
          {isLoggedIn ? (
            <p className="text-sm text-slate-600">✓ All features available</p>
          ) : (
            <p className="text-sm text-slate-600">🔒 Sign in to unlock all features</p>
          )}
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Quick CGPA Calculator",
              items: ["Instantly calculate CGPA", "Input courses and grades", "5.0 grading scale support", "Print or save reports"],
              restricted: false,
            },
            {
              title: "Student Tools",
              items: ["GPA to CGPA converter", "Weighted grade calculator", "Track previous semesters", "Plan future coursework"],
              restricted: true,
            },
            {
              title: "Advanced Features",
              items: ["Export reports as PDF", "Secure account storage", "Compare semester performance"],
              restricted: true,
            },
          ].map((card) => (
            <div
              key={card.title}
              className={`overflow-hidden rounded-3xl border transition hover:-translate-y-1 hover:shadow-lg sm:p-8 p-6 text-slate-900 shadow-sm ${
                card.restricted && !isLoggedIn
                  ? "border-slate-200 bg-slate-50/50 opacity-70"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-950">{card.title}</h2>
                {card.restricted && !isLoggedIn && <span className="text-xs font-semibold text-slate-500">🔒 PRO</span>}
              </div>
              <ul className="space-y-3 text-sm text-slate-600 sm:text-base">
                {card.items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-blue-600" />
                    <span className={card.restricted && !isLoggedIn ? "line-through text-slate-400" : ""}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              {card.restricted && !isLoggedIn && (
                <button
                  onClick={() => route("/signup")}
                  className="mt-4 w-full rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                >
                  Sign up to unlock
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-16 bg-slate-800 text-slate-200">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 sm:px-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xl space-y-4">
            <h3 className="text-2xl font-bold text-white">CGPA Calculator</h3>
            <p className="leading-relaxed text-slate-400">
              A polished academic tool built to help students calculate GPAs, compare semester progress, and keep every result accessible in one secure place.
            </p>
            <p className="text-sm text-slate-500">Designed for clarity, speed, and smarter academic planning.</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            <div>
              <h4 className="mb-4 text-lg font-semibold text-white">Explore</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="/" className="transition hover:text-blue-300">Home</a></li>
                {isLoggedIn && <li><a href="/dashboard" className="transition hover:text-blue-300">Dashboard</a></li>}
                {isLoggedIn && <li><a href="/gpacalculate" className="transition hover:text-blue-300">Calculate</a></li>}
                {!isLoggedIn && <li><a href="/login" className="transition hover:text-blue-300">Login</a></li>}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-lg font-semibold text-white">Support</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>Fast, easy setup</li>
                <li>Secure progress saving</li>
                <li>Student-focused design</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-lg font-semibold text-white">Contact</h4>
              <p className="text-sm text-slate-400">
                Email: <a href="mailto:mbsk102@gmail.com" className="text-blue-300 hover:underline">mbsk102@gmail.com</a>
              </p>
              <p className="mt-2 text-sm text-slate-400">Phone: +234 814 914 0477</p>
              <div className="mt-4 flex items-center gap-4 text-slate-300">
                <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" className="transition hover:text-blue-300">
                  <FaLinkedinIn size={22} />
                </a>
                <a href="https://www.instagram.com/mb.sk0?igsh=aG5tcDZiczhwY2Rw" target="_blank" rel="noopener noreferrer" className="transition hover:text-pink-300">
                  <FaInstagram size={24} />
                </a>
                <a href="https://wa.me/2348149140477" target="_blank" rel="noopener noreferrer" className="transition hover:text-emerald-300">
                  <FaWhatsapp size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 px-6 py-6 text-center text-sm text-slate-400 sm:px-8">
          © 2025 CGPA Calculator. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
