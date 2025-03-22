import { useState, useEffect } from "react";
import api from "../../lib/axios";

const PresentationScheduleReport = () => {
const [presentations, setPresentations] = useState([]);
const [searchQuery, setSearchQuery] = useState("");
const [filteredPresentations, setFilteredPresentations] = useState([]);

useEffect(() => {
api.get("/api/presentations")
    .then((res) => setPresentations(res.data))
    .catch((err) => console.error("Error fetching presentations", err));
}, []);

useEffect(() => {
// Filter presentations based on search query (both year and module)
const filtered = presentations.filter((presentation) => {
    const matchesYear = searchQuery ? presentation.year.toString().includes(searchQuery) : true;
    const matchesModule = searchQuery ? presentation.module.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    return matchesYear || matchesModule;
});
setFilteredPresentations(filtered);
}, [searchQuery, presentations]);

return (
<div className="max-w-6xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg border border-gray-300">
    <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Presentation Schedule Report</h2>

    {/* Search Filter */}
    <div className="mb-6">
    <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by Year or Module"
        className="w-full p-3 border rounded-lg bg-gray-100"
    />
    </div>

    {/* Table to display filtered presentations */}
    <div className="overflow-x-auto mt-6">
    <table className="w-full table-auto border-collapse border border-gray-300 rounded-lg shadow-md">
        <thead>
        <tr className="bg-blue-100">
            <th className="p-3 border-b">Year</th>
            <th className="p-3 border-b">Semester</th>
            <th className="p-3 border-b">Module</th>
            <th className="p-3 border-b">Examiner</th>
            <th className="p-3 border-b">Date</th>
            <th className="p-3 border-b">Duration</th>
            <th className="p-3 border-b">Status</th>
        </tr>
        </thead>
        <tbody>
        {filteredPresentations.map((presentation) => (
            <tr key={presentation._id} className="hover:bg-gray-100 transition duration-200">
            <td className="p-3 border-b text-center">{presentation.year}</td>
            <td className="p-3 border-b text-center">{presentation.semester}</td>
            <td className="p-3 border-b text-center">{presentation.module}</td>
            <td className="p-3 border-b text-center">{presentation.examiner}</td>
            <td className="p-3 border-b text-center">{new Date(presentation.date).toLocaleDateString()}</td>
            <td className="p-3 border-b text-center">{presentation.duration} mins</td>
            <td className="p-3 border-b text-center">{presentation.status}</td>
            </tr>
        ))}
        </tbody>
    </table>
    </div>
</div>
);
};

export default PresentationScheduleReport;
