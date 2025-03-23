import { useState, useEffect } from "react";
import api from "../../lib/axios";
import timetable from "./timetable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PresentationSchedule = () => {
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [module, setModule] = useState("");
  const [modules, setModules] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [examiners, setExaminers] = useState([]);
  const [filteredExaminers, setFilteredExaminers] = useState([]);
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");
  const [examiner, setExaminer] = useState("");
  const [message, setMessage] = useState("");
  const [presentations, setPresentations] = useState([]);
  const [editId, setEditId] = useState(null);
  const [validDates, setValidDates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    api.get("/api/modules")
      .then((res) => setModules(res.data))
      .catch((err) => console.error("Error fetching modules", err));
  }, []);

  useEffect(() => {
    api.get("/api/examiners")
      .then((res) => setExaminers(res.data))
      .catch((err) => console.error("Error fetching examiners", err));
  }, []);

  useEffect(() => {
    if (year && semester) {
      const filtered = modules.filter(
        (m) => parseInt(m.year) === parseInt(year) &&
          parseInt(m.semester) === parseInt(semester)
      );
      setFilteredModules(filtered);
    } else {
      setFilteredModules([]);
    }
  }, [year, semester, modules]);

  useEffect(() => {
    if (module) {
      const filtered = examiners.filter((ex) =>
        Array.isArray(ex.module) && ex.module.includes(modules.find((m) => m.moduleCode === module)?.moduleName)
      );      
      setFilteredExaminers(filtered);
    } else {
      setFilteredExaminers([]);
    }
  }, [module, examiners, modules]);

  const dayMapping = {
    "Sunday": 0,
    "Monday": 1,
    "Tuesday": 2,
    "Wednesday": 3,
    "Thursday": 4,
    "Friday": 5,
    "Saturday": 6
  };

  useEffect(() => {
    if (module) {
      const selectedModuleTimetable = timetable.find((t) => t.moduleCode === module);

      if (selectedModuleTimetable) {
        const availableSlots = [];
        const today = new Date();

        for (let i = 0; i < 14; i++) {
          const currentDate = new Date();
          currentDate.setDate(today.getDate() + i);
          const currentDay = currentDate.getDay();

          selectedModuleTimetable.timeSlots.forEach((slot) => {
            if (dayMapping[slot.date] === currentDay) {
              availableSlots.push({
                date: currentDate.toISOString().split("T")[0],
                day: slot.date,
                startTime: slot.startTime,
                endTime: slot.endTime,
                room: slot.room,
              });
            }
          });
        }

        console.log("Available Slots:", availableSlots);
        setValidDates(availableSlots);
      } else {
        setValidDates([]);
      }
    } else {
      setValidDates([]);
    }
  }, [module, timetable]);

  useEffect(() => {
    api.get("/api/presentations")
      .then((res) => setPresentations(res.data))
      .catch((err) => console.error("Error fetching presentations", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!year || !semester || !module || !date || !duration) {
      toast.error("Please fill all fields");
      return;
    }
  
    const durationValue = parseInt(duration);
    if (durationValue < 10 || durationValue > 30) {
      toast.error("Duration must be between 10 and 30 minutes");
      return;
    }
  
    try {
      const moduleName = modules.find(
        (m) => m.moduleCode === module
      )?.moduleName;
      const presentationData = {
        year,
        semester,
        module: moduleName,
        examiner,
        date,
        duration: durationValue,
        status: "pending",
      };
  
      if (editId) {
        await api.put(`/api/presentations/${editId}`, presentationData);
        toast.success("Presentation updated successfully");
      } else {
        await api.post("/api/presentations/schedule", presentationData);
        toast.success("Presentation Scheduled Successfully");
      }
  
      const res = await api.get("/api/presentations");
      setPresentations(res.data);
      setEditId(null);
      setYear("");
      setSemester("");
      setModule("");
      setDate("");
      setDuration("");
      setExaminer("");
    } catch (err) {
      console.error("Error scheduling presentation", err);
      toast.error("Error scheduling presentation");
    }
  };
  

  const handleEdit = (presentation) => {
    setYear(presentation.year);
    setSemester(presentation.semester);
    setModule(
      modules.find((m) => m.moduleName === presentation.module)?.moduleCode ||
      ""
    );
    setExaminer(presentation.examiner);
    setDate(presentation.date);
    setDuration(presentation.duration);
    setEditId(presentation._id);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/presentations/${id}`);
      toast.success("Presentation deleted successfully");

      const res = await api.get("/api/presentations");
      setPresentations(res.data);
    } catch (error) {
      console.error("Error deleting presentation", error);
      toast.error("Error deleting presentation");
    }
  };

  return (
    <div className="container mx-auto p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen rounded-2xl">
      <ToastContainer />
      <h2 className="text-4xl font-bold text-center mb-8 text-gray-900">Schedule Presentation</h2>
      {message && <p className="mb-4 text-center text-green-600 font-medium">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full p-3 border rounded-lg bg-white/80 backdrop-blur-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="">Select Year</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="w-full p-3 border rounded-lg bg-white/80 backdrop-blur-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="">Select Semester</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </div>
        <select
          value={module}
          onChange={(e) => setModule(e.target.value)}
          className="w-full p-3 border rounded-lg bg-white/80 backdrop-blur-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        >
          <option value="">Select Module</option>
          {filteredModules.map((mod) => (
            <option key={mod._id} value={mod.moduleCode}>{mod.moduleName}</option>
          ))}
        </select>
        <select
          value={examiner}
          onChange={(e) => setExaminer(e.target.value)}
          className="w-full p-3 border rounded-lg bg-white/80 backdrop-blur-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        >
          <option value="">Select Examiner</option>
          {filteredExaminers.map((ex) => (
            <option key={ex._id} value={ex.name}>{ex.name}</option>
          ))}
        </select>
        <div className="w-full p-3 border rounded-lg bg-white/80 backdrop-blur-lg">
          <label className="block text-gray-700 font-medium mb-2">Select Date & Time</label>
          {validDates.length > 0 ? (
            <div className="max-h-60 overflow-y-auto border rounded-lg p-2 bg-white/80 backdrop-blur-lg">
              {validDates.map((slot, index) => (
                <div
                  key={index}
                  className={`p-3 cursor-pointer rounded-md border ${
                    date === slot.date ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white' : 'hover:bg-gray-50/50'
                  } transition-colors`}
                  onClick={() => setDate(slot.date)}
                >
                  <p className="font-semibold">{slot.date} ({slot.day})</p>
                  <p className="text-sm">Time: {slot.startTime} - {slot.endTime}</p>
                  <p className="text-sm">Room: {slot.room}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-red-500">No available slots</p>
          )}
        </div>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Duration (minutes)"
          className="w-full p-3 border rounded-lg bg-white/80 backdrop-blur-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-medium transition duration-300"
        >
          {editId ? "Update Presentation" : "Schedule Presentation"}
        </button>
      </form>
  
      <h3 className="text-2xl font-semibold text-gray-800 mt-10 mb-6 text-center">Scheduled Presentations</h3>
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Module or Status"
          className="w-full p-3 border rounded-lg bg-white/80 backdrop-blur-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-8">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-[#000B58] to-indigo-800 text-white">
              <th className="py-4 px-6 text-left rounded-tl-2xl">Status</th>
              <th className="py-4 px-6 text-left">Year</th>
              <th className="py-4 px-6 text-left">Semester</th>
              <th className="py-4 px-6 text-left">Module</th>
              <th className="py-4 px-6 text-left">Examiner</th>
              <th className="py-4 px-6 text-left">Date</th>
              <th className="py-4 px-6 text-left">Duration</th>
              <th className="py-4 px-6 text-left rounded-tr-2xl">Actions</th>
            </tr>
          </thead>
          <tbody>
            {presentations
              .filter((presentation) => {
                const lowerSearchTerm = searchTerm.toLowerCase();
                return (
                  presentation.module.toLowerCase().includes(lowerSearchTerm) ||
                  presentation.status.toLowerCase().includes(lowerSearchTerm)
                );
              })
              .map((presentation) => {
                let statusColor, statusDot;
  
                switch (presentation.status.toLowerCase()) {
                  case "pending":
                    statusColor = "text-yellow-500";
                    statusDot = "🟡";
                    break;
                  case "approved":
                    statusColor = "text-green-500";
                    statusDot = "🟢";
                    break;
                  case "rejected":
                    statusColor = "text-red-500";
                    statusDot = "🔴";
                    break;
                  default:
                    statusColor = "text-gray-500";
                    statusDot = "⚪";
                }
                return (
                  <tr key={presentation._id} className="border-b hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <span className={`text-lg ${statusColor}`}>{statusDot}</span>
                      <span className="ml-2 capitalize">{presentation.status}</span>
                    </td>
                    <td className="py-4 px-6">{presentation.year}</td>
                    <td className="py-4 px-6">{presentation.semester}</td>
                    <td className="py-4 px-6">{presentation.module}</td>
                    <td className="py-4 px-6">{presentation.examiner}</td>
                    <td className="py-4 px-6">{new Date(presentation.date).toLocaleDateString()}</td>
                    <td className="py-4 px-6">{presentation.duration} mins</td>
                    <td className="py-4 px-6 flex space-x-2">
                      <button
                        onClick={() => handleEdit(presentation)}
                        className="btn btn-soft btn-primary px-4 py-2 rounded-md transition-colors mr-2"
                      >
                        Modify
                      </button>
                      <button
                        onClick={() => handleDelete(presentation._id)}
                        className="btn btn-soft btn-error px-4 py-2 rounded-md transition-colors"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PresentationSchedule;