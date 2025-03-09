import { useState, useEffect } from "react";
import api from "../../lib/axios";

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
const [examiner, setExaminer] = useState(""); // Add state for examiner
const [message, setMessage] = useState("");
const [presentations, setPresentations] = useState([]);
const [editId, setEditId] = useState(null); // State for the presentation being edited

useEffect(() => {
api
    .get("/api/modules")
    .then((res) => setModules(res.data))
    .catch((err) => console.error("Error fetching modules", err));
}, []);

useEffect(() => {
api
    .get("/api/examiners")
    .then((res) => setExaminers(res.data))
    .catch((err) => console.error("Error fetching examiners", err));
}, []);

useEffect(() => {
// Filter modules based on year and semester
if (year && semester) {
    const filtered = modules.filter(
    (m) =>
        parseInt(m.year) === parseInt(year) &&
        parseInt(m.semester) === parseInt(semester)
    );
    setFilteredModules(filtered);
} else {
    setFilteredModules([]);
}
}, [year, semester, modules]);

useEffect(() => {
// Filter examiners based on the selected module
if (module) {
    const filtered = examiners.filter(
    (ex) =>
        ex.module === modules.find((m) => m.moduleCode === module)?.moduleName
    );
    setFilteredExaminers(filtered);
} else {
    setFilteredExaminers([]);
}
}, [module, examiners, modules]);

useEffect(() => {
// Fetch scheduled presentations
api
    .get("/api/presentations")
    .then((res) => setPresentations(res.data))
    .catch((err) => console.error("Error fetching presentations", err));
}, []);

const handleSubmit = async (e) => {
e.preventDefault();
if (!year || !semester || !module || !date || !duration) {
    setMessage("Please fill all fields");
    return;
}

try {
    const moduleName = modules.find(
    (m) => m.moduleCode === module
    )?.moduleName;
    const presentationData = {
    year,
    semester,
    module: moduleName, // Save moduleName
    examiner, // Set examiner name directly from the form
    date,
    duration,
    };

    if (editId) {
    // Update presentation if editId exists
    await api.put(`/api/presentations/${editId}`, presentationData);
    setMessage("Presentation updated successfully");
    } else {
    // Schedule new presentation
    await api.post("/api/presentations/schedule", presentationData);
    setMessage("Presentation Scheduled Successfully");
    }

    // Fetch the updated presentations after successful scheduling or update
    const res = await api.get("/api/presentations");
    setPresentations(res.data);
    setEditId(null); // Reset editId after submission
    setYear("");
    setSemester("");
    setModule("");
    setDate("");
    setDuration("");
    setExaminer(""); // Reset examiner after submit
} catch (err) {
    console.error("Error scheduling presentation", err);
    setMessage("Error scheduling presentation");
}
};

const handleEdit = (presentation) => {
// Set form state with the data from the selected presentation
setYear(presentation.year);
setSemester(presentation.semester);
setModule(
    modules.find((m) => m.moduleName === presentation.module)?.moduleCode ||
    ""
); // Set moduleCode based on moduleName
setExaminer(presentation.examiner); // Set examiner name from the presentation
setDate(presentation.date);
setDuration(presentation.duration);
setEditId(presentation._id); // Set the editId to the selected presentation's ID
};

const handleDelete = async (id) => {
try {
    await api.delete(`/api/presentations/${id}`);
    setMessage("Presentation deleted successfully");

    // Fetch the updated presentations after deletion
    const res = await api.get("/api/presentations");
    setPresentations(res.data);
} catch (error) {
    console.error("Error deleting presentation", error);
}
};

return (
<div className="max-w-4xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg border border-gray-300">
    <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">
    Schedule Presentation
    </h2>
    {message && (
    <p className="mb-4 text-center text-green-600 font-medium">{message}</p>
    )}
    <form onSubmit={handleSubmit} className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
        <select
        value={year}
        onChange={(e) => setYear(e.target.value)}
        className="w-full p-3 border rounded-lg bg-gray-100"
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
        className="w-full p-3 border rounded-lg bg-gray-100"
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
        className="w-full p-3 border rounded-lg bg-gray-100"
        required
    >
        <option value="">Select Module</option>
        {filteredModules.map((mod) => (
        <option key={mod._id} value={mod.moduleCode}>
            {mod.moduleName}
        </option>
        ))}
    </select>
    <select
        value={examiner}
        onChange={(e) => setExaminer(e.target.value)}
        className="w-full p-3 border rounded-lg bg-gray-100"
        required
    >
        <option value="">Select Examiner</option>
        {filteredExaminers.map((ex) => (
        <option key={ex._id} value={ex.name}>
            {ex.name}
        </option>
        ))}
    </select>
    <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full p-3 border rounded-lg bg-gray-100"
        required
    />
    <input
        type="number"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        placeholder="Duration (minutes)"
        className="w-full p-3 border rounded-lg bg-gray-100"
        required
    />
    <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-medium transition duration-300"
    >
        {editId ? "Update Presentation" : "Schedule Presentation"}
    </button>
    </form>

    {/* Display the scheduled presentations */}
    <h3 className="text-xl font-semibold mt-10 mb-4 text-gray-900">
    Scheduled Presentations
    </h3>
    <table className="w-full table-auto border-collapse border border-gray-300">
    <thead>
        <tr>
        <th className="p-3 border-b">Year</th>
        <th className="p-3 border-b">Semester</th>
        <th className="p-3 border-b">Module</th>
        <th className="p-3 border-b">Examiner</th>
        <th className="p-3 border-b">Date</th>
        <th className="p-3 border-b">Duration (min)</th>
        <th className="p-3 border-b">Actions</th>
        </tr>
    </thead>
    <tbody>
        {presentations.map((presentation) => (
        <tr key={presentation._id}>
            <td className="p-3 border-b">{presentation.year}</td>
            <td className="p-3 border-b">{presentation.semester}</td>
            <td className="p-3 border-b">{presentation.module}</td>
            <td className="p-3 border-b">{presentation.examiner}</td>
            <td className="p-3 border-b">{presentation.date}</td>
            <td className="p-3 border-b">{presentation.duration}</td>
            <td className="p-3 border-b">
            <button
                onClick={() => handleEdit(presentation)}
                className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition duration-300"
            >
                Edit
            </button>
            <button
                onClick={() => handleDelete(presentation._id)}
                className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded-lg transition duration-300"
            >
                Delete
            </button>
            </td>
        </tr>
        ))}
    </tbody>
    </table>
</div>
);
};

export default PresentationSchedule;
