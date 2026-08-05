import { useState, useRef } from "preact/hooks";
import type { FunctionalComponent } from "preact";
import type { RoutableProps } from "preact-router";
import { motion, AnimatePresence } from "framer-motion";
import { route } from "preact-router";
import { Trash2 } from "lucide-react";
import { api } from "../utils/api";
import UserNavbar from "../components/layout/UserNavbar";

const gradePoints: Record<string, number> = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
  E: 1,
  F: 0,
}
interface Course {
  code: string;
  grade: string;
  units: number;
}

const GpaCalculator: FunctionalComponent<RoutableProps> = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const [numCourses, setNumCourses] = useState(0);
  const [courses, setCourses] = useState<Course[]>([]);
  const [gpa, setGpa] = useState<number | null>(null);
  const [totalUnits, setTotalUnits] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [showModal, setShowModal] = useState(false);
  // removed duplicate isLoggedIn

  const resultRef = useRef<HTMLDivElement>(null);

  // ✅ Generate course fields
  const generateFields = () => {
    const newCourses: Course[] = Array(numCourses).fill({
      code: "",
      grade: "",
      units: 0,
    });
    setCourses(newCourses);
    setGpa(null);
  };
  const updateCourse = (index: number, field: keyof Course, value: string | number) => {
    const updated = [...courses];
    updated[index] = { ...updated[index], [field]: value };
    setCourses(updated);
  };
  const removeCourse = (index: number) => {
    const updated = courses.filter((_, i) => i !== index);
    setCourses(updated);
  };

  // ✅ Add new course
  const addCourse = () => {
    setCourses([...courses, { code: "", grade: "", units: 0 }]);
  };

  // ✅ Reset all
  const resetAll = () => {
    setNumCourses(0);
    setCourses([]);
    setGpa(null);
    setTotalUnits(0);
    setTotalPoints(0);
  };

  // ✅ Calculate GPA
  const calculateGPA = () => {
    let totalUnits = 0;
    let totalPoints = 0;

    courses.forEach((c) => {
      if (c.grade && c.units > 0) {
        totalUnits += c.units;
        totalPoints += gradePoints[c.grade] * c.units;
      }
    });

    setTotalUnits(totalUnits);
    setTotalPoints(totalPoints);
    setGpa(totalUnits > 0 ? totalPoints / totalUnits : 0);
  };

  // Modal for year/semester input
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [yearInput, setYearInput] = useState("");
  const [semesterInput, setSemesterInput] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // Save results with modal
  const saveResults = () => {
    if (!isLoggedIn) {
      setShowModal(true);
      return;
    }
    setShowSaveModal(true);
  };

  // Actually send results after getting year/semester
  const handleSaveConfirm = async () => {
    if (!courses || !Array.isArray(courses) || courses.length === 0) {
      setToastMsg("You must enter at least one valid course to save results.");
      setShowToast(true);
      setShowSaveModal(false);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("currentUser") || '{}');
      const gpaValue = gpa;
      const res = await api.addResult({
        userId: user._id,
        semester: `${yearInput} - ${semesterInput}`,
        gpa: gpaValue,
        courses,
      }, token!);
      const data = await res.json();
      if (res.ok) {
        setToastMsg("Results saved successfully!");
        setShowSaveModal(false);
        setYearInput("");
        setSemesterInput("");
      } else {
        setToastMsg(data.message || "Failed to save results.");
        setShowSaveModal(false);
      }
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      setToastMsg("Network or server error. Please try again.");
      setShowSaveModal(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };


  // ✅ Print results
  const handlePrint = () => {
    if (resultRef.current) {
      const printContents = resultRef.current.innerHTML;
      const win = window.open("", "_blank");
      win?.document.write(`<pre>${printContents}</pre>`);
      win?.document.close();
      win?.print();
    }
  };

  return (
    <>
<div className="min-h-screen bg-white text-slate-900">
      {/* Navbar (shared UserNavbar) */}
      <UserNavbar active="calculate" />

      <div className="p-6 max-w-4xl mx-auto pt-28">
      {/* Course Information */}
      <motion.div
        className="bg-white p-6 rounded-lg mb-6 shadow-sm border border-slate-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">📘</span>
          <h2 className="text-2xl font-bold text-slate-950">Course Information</h2>
        </div>
        <p className="text-slate-500 text-sm mb-6">
          Enter the number of courses you are taking this semester to begin.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="number"
            value={numCourses}
            placeholder="e.g. 6"
            onInput={(e) =>
              setNumCourses(parseInt((e.target as HTMLInputElement).value) || 0)
            }
            className="flex-1 p-3 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={generateFields}
            className="px-6 py-3 rounded-lg font-semibold shadow-sm border border-blue-600 bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md transition-all duration-300 ease-in-out"
          >
            ✨ Generate Fields
          </motion.button>
        </div>
      </motion.div>

      {/* ✅ Course Fields */}
      <AnimatePresence>
        {courses.length > 0 && (
          <motion.div
            key="courseFields"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 rounded-lg mb-6 shadow-sm border border-slate-200 mt-4 overflow-hidden"
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">📄</span>
              <h2 className="text-2xl font-bold text-slate-950">
                Enter Course Details
              </h2>
            </div>

            {/* Column headers */}
            <div className="grid grid-cols-12 gap-4 text-slate-600 font-medium mb-3">
              <div className="col-span-3">Course Code</div>
              <div className="col-span-3">Grade</div>
              <div className="col-span-3">Course Units</div>
              <div className="col-span-3">Actions</div>
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {courses.map((c, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    exit={{
                      opacity: 0,
                      x: 50,
                      scale: 0.9,
                      height: 0,
                      margin: 0,
                      padding: 0,
                    }}
                    className="grid grid-cols-12 gap-4 bg-slate-50 rounded-lg px-4 py-3 items-center border border-slate-200 overflow-hidden"
                  >
                    {/* Course Code */}
                    <input
                      type="text"
                      value={c.code}
                      placeholder="e.g. CSC101"
                      onInput={(e) =>
                        updateCourse(
                          i,
                          "code",
                          (e.target as HTMLInputElement).value
                        )
                      }
                      className="col-span-3 px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* Grade */}
                    <select
                      value={c.grade}
                      onInput={(e) =>
                        updateCourse(
                          i,
                          "grade",
                          (e.target as HTMLSelectElement).value
                        )
                      }
                      className="col-span-3 px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Grade</option>
                      {Object.keys(gradePoints).map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>

                    {/* Units */}
                    <input
                      type="number"
                      value={c.units || ""}
                      placeholder="Units"
                      onInput={(e) =>
                        updateCourse(
                          i,
                          "units",
                          parseInt((e.target as HTMLInputElement).value) || 0
                        )
                      }
                      className="col-span-3 px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* Delete button */}
                    <button
                      onClick={() => removeCourse(i)}
                      className="col-span-3 flex ml-4 items-center justify-center w-10 h-10 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-md"
                      title="Remove course"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Action Buttons */}
      {courses.length > 0 && (
        <div className="flex justify-center gap-4 mb-6">
          {["✅ Calculate GPA", "➕ Add Course", "🔄 Reset All"].map(
            (label, idx) => {
              const actions = [calculateGPA, addCourse, resetAll];
              return (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={actions[idx]}
                  className="px-6 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg"
                >
                  {label}
                </motion.button>
              );
            }
          )}
        </div>
      )}

      {/* ✅ GPA Result */}
      <AnimatePresence>
        {gpa && (
          <div
            ref={resultRef}
            key="gpaResult"
            className="bg-slate-50 border border-slate-200 p-6 rounded-lg text-center overflow-hidden"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
            >
              <div>
                <h2 className="text-xl font-semibold">🎓 GPA Result</h2>
                <p>
                  Total Units: <span className="font-bold">{totalUnits}</span>
                </p>
                <p>
                  Total Grade Points: <span className="font-bold">{totalPoints}</span>
                </p>
                <p className="text-3xl font-bold mt-2 text-blue-400">
                  GPA: {gpa.toFixed(2)}
                </p>
                <div className="mt-4 flex gap-3 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={saveResults}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg"
                  >
                    💾 Save Results {isLoggedIn ? "" : "(Login Required)"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePrint}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                  >
                    🖨 Print Result
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Save Results Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-2">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-4 sm:p-6 rounded-lg shadow-lg border border-slate-200 w-full max-w-xs sm:max-w-md md:max-w-lg text-center"
          >
            <h2 className="text-xl font-bold mb-4">Save Results</h2>
            <div className="mb-4">
              <label className="block text-left mb-2 font-medium">Academic Year</label>
              <input
                type="text"
                value={yearInput}
                onInput={e => setYearInput((e.target as HTMLInputElement).value)}
                placeholder="e.g. 2024/2025"
                className="w-full p-2 rounded bg-white border border-slate-300 text-slate-900 mb-3"
              />
              <label className="block text-left mb-2 font-medium">Semester</label>
              <input
                type="text"
                value={semesterInput}
                onInput={e => setSemesterInput((e.target as HTMLInputElement).value)}
                placeholder="e.g. 1st Semester"
                className="w-full p-2 rounded bg-white border border-slate-300 text-slate-900"
              />
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={handleSaveConfirm}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg"
                disabled={!yearInput || !semesterInput}
              >
                Save
              </button>
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-950 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all animate-fade-in">
          <span className="font-semibold">{toastMsg}</span>
        </div>
      )}
      {/* 🔒 Popup Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-lg border border-slate-200 w-96 text-center"
          >
            <h2 className="text-xl font-bold mb-4">🔒 Sign Up Required</h2>
            <p className="mb-6">You need an account to save your GPA results.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => route("/signup")}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg"
              >
                Create Account
              </button>
              <button
                onClick={() => route("/login")}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                Log In
              </button>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="mt-6 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}
      </div>
    </div>
    </>
  );
};

export default GpaCalculator;
