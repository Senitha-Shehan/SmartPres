import { useState, useEffect } from "react";
import api from "../../lib/axios";
import { useLocation } from "react-router-dom";

const StudentPresentations = ({ studentId }) => {
const [presentations, setPresentations] = useState([]);
const [registeredModules, setRegisteredModules] = useState([]);
const [filteredPresentations, setFilteredPresentations] = useState([]);
const [studentName, setStudentName] = useState("");
const { username } = location.state || {}; //

useEffect(() => {
// Fetch student's registered modules
api
    .get(`/api/students/${studentId}/modules`)
    .then((res) => setRegisteredModules(res.data))
    .catch((err) => console.error("Error fetching student modules", err));

// Fetch all presentations
api
    .get("/api/presentations")
    .then((res) => setPresentations(res.data))
    .catch((err) => console.error("Error fetching presentations", err));

// Fetch student information (e.g., student name)
api
    .get(`/api/students/${studentId}`)
    .then((res) => setStudentName(res.data.name)) // Assuming the response contains a 'name' field
    .catch((err) => console.error("Error fetching student info", err));
}, [studentId]);

useEffect(() => {
if (registeredModules.length > 0) {
    // Filter presentations based on registered modules
    const filtered = presentations.filter((pres) =>
    registeredModules.some((mod) => mod.moduleName === pres.module)
    );
    setFilteredPresentations(filtered);
}
}, [presentations, registeredModules]);

return (
<div className="max-w-4xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg border border-gray-300">
    <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">
    Welcome, {username || "Student"} ({studentId})
    </h2>
    <h3 className="text-xl font-semibold mb-6 text-center text-gray-700">
    Upcoming Presentations
    </h3>

    {filteredPresentations.length > 0 ? (
    <table className="w-full border-collapse border border-gray-300">
        <thead>
        <tr className="bg-blue-100">
            <th className="border p-3">Module</th>
            <th className="border p-3">Examiner</th>
            <th className="border p-3">Date</th>
            <th className="border p-3">Time</th>
            <th className="border p-3">Room</th>
            <th className="border p-3">Duration</th>
        </tr>
        </thead>
        <tbody>
        {filteredPresentations.map((pres) => (
            <tr key={pres._id} className="text-center">
            <td className="border p-3">{pres.module}</td>
            <td className="border p-3">{pres.examiner}</td>
            <td className="border p-3">{pres.date}</td>
            <td className="border p-3">
                {pres.startTime} - {pres.endTime}
            </td>
            <td className="border p-3">{pres.room}</td>
            <td className="border p-3">{pres.duration} min</td>
            </tr>
        ))}
        </tbody>
    </table>
    ) : (
    <p className="text-center text-red-500">No upcoming presentations</p>
    )}
</div>
);
};

export default StudentPresentations;
