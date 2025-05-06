import React, { useEffect, useState } from "react";
import axios from "../../lib/axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const EvaluationReport = () => {
const [evaluations, setEvaluations] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [filter, setFilter] = useState({
module: "",
examinerID: "",
});
const [sortConfig, setSortConfig] = useState({
key: "groupID",
direction: "ascending",
});

useEffect(() => {
const fetchEvaluations = async () => {
    try {
    const response = await axios.get("/api/evaluation");
    setEvaluations(response.data);
    } catch (err) {
    setError("Failed to fetch evaluations. Please try again later.");
    console.error("Error fetching evaluations:", err);
    } finally {
    setLoading(false);
    }
};
fetchEvaluations();
}, []);

const handleFilterChange = (e) => {
const { name, value } = e.target;
setFilter((prev) => ({
    ...prev,
    [name]: value,
}));
};

const requestSort = (key) => {
let direction = "ascending";
if (sortConfig.key === key && sortConfig.direction === "ascending") {
    direction = "descending";
}
setSortConfig({ key, direction });
};

const extractModuleCode = (groupID) => {
const match = groupID.match(/^[^\d]+/);
return match ? match[0] : "Unknown";
};

const sortedEvaluations = [...evaluations].sort((a, b) => {
if (a[sortConfig.key] < b[sortConfig.key]) {
    return sortConfig.direction === "ascending" ? -1 : 1;
}
if (a[sortConfig.key] > b[sortConfig.key]) {
    return sortConfig.direction === "ascending" ? 1 : -1;
}
return 0;
});

const filteredEvaluations = sortedEvaluations.filter((evalItem) => {
const moduleCode = extractModuleCode(evalItem.groupID).toLowerCase();
return (
    (filter.module === "" || moduleCode.includes(filter.module.toLowerCase())) &&
    (filter.examinerID === "" || evalItem.examinerID.toLowerCase().includes(filter.examinerID.toLowerCase()))
);
});

const getSortIndicator = (key) => {
if (sortConfig.key === key) {
    return sortConfig.direction === "ascending" ? "↑" : "↓";
}
return null;
};

const generatePDF = () => {
const doc = new jsPDF();
doc.setFontSize(18);
doc.text("Evaluation Report", 105, 15, { align: "center" });

const headers = [["Module", "Group ID", "Examiner ID", "Marks", "Remarks", "Date"]];
const data = filteredEvaluations.map((item) => [
    extractModuleCode(item.groupID),
    item.groupID,
    item.examinerID,
    item.marks,
    item.remarks,
    new Date(item.createdAt).toLocaleDateString(),
]);

autoTable(doc, {
    head: headers,
    body: data,
    startY: 30,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [0, 11, 88] },
});

doc.save("evaluation_report.pdf");
};

if (loading) {
return (
    <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
);
}

if (error) {
return (
    <div className="container mx-auto p-8">
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
    </div>
    </div>
);
}

return (
<div className="container mx-auto p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen rounded-2xl">
    <div className="flex justify-between items-center mb-8">
    <h1 className="text-4xl font-bold text-gray-900">Evaluation Report</h1>
    <button
        onClick={generatePDF}
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
    >
        Download PDF
    </button>
    </div>

    <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-8 mb-8">
    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Filters</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Module</label>
        <input
            type="text"
            name="module"
            value={filter.module}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Filter by Module (e.g., CS, IT)"
        />
        </div>
        <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Examiner ID</label>
        <input
            type="text"
            name="examinerID"
            value={filter.examinerID}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Filter by Examiner"
        />
        </div>
    </div>
    </div>

    <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-8 overflow-x-auto">
    <h2 className="text-2xl font-semibold text-gray-800 mb-6">All Evaluations</h2>
    {filteredEvaluations.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
        No evaluations found matching your criteria
        </div>
    ) : (
        <table className="w-full table-auto border-collapse">
        <thead>
            <tr className="bg-gradient-to-r from-[#000B58] to-indigo-800 text-white">
            <th className="py-4 px-6 text-left">Module</th>
            <th className="py-4 px-6 text-left cursor-pointer" onClick={() => requestSort("groupID")}>
                Group ID {getSortIndicator("groupID")}
            </th>
            <th className="py-4 px-6 text-left cursor-pointer" onClick={() => requestSort("examinerID")}>
                Examiner ID {getSortIndicator("examinerID")}
            </th>
            <th className="py-4 px-6 text-left cursor-pointer" onClick={() => requestSort("marks")}>
                Marks {getSortIndicator("marks")}
            </th>
            <th className="py-4 px-6 text-left">Remarks</th>
            <th className="py-4 px-6 text-left">Date</th>
            </tr>
        </thead>
        <tbody>
            {filteredEvaluations.map((evalItem, index) => (
            <tr
                key={index}
                className={`border-b hover:bg-gray-50/50 transition-colors ${
                index % 2 === 0 ? "bg-white/50" : "bg-gray-50/50"
                }`}
            >
                <td className="py-4 px-6 font-medium">{extractModuleCode(evalItem.groupID)}</td>
                <td className="py-4 px-6 font-medium">{evalItem.groupID}</td>
                <td className="py-4 px-6">{evalItem.examinerID}</td>
                <td className="py-4 px-6">
                <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                    evalItem.marks >= 70
                        ? "bg-green-100 text-green-800"
                        : evalItem.marks >= 50
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}
                >
                    {evalItem.marks}
                </span>
                </td>
                <td className="py-4 px-6 max-w-xs truncate">{evalItem.remarks}</td>
                <td className="py-4 px-6">{new Date(evalItem.createdAt).toLocaleDateString()}</td>
            </tr>
            ))}
        </tbody>
        </table>
    )}
    </div>
</div>
);
};

export default EvaluationReport;
