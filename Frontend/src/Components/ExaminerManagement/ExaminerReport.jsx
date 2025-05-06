import React, { useState, useEffect, useRef } from "react";
import api from "../../lib/axios";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


const ExaminerReport = () => {
const [formData, setFormData] = useState({
examinerID: "",
name: "",
module: [],
email: "",
});
const [examiners, setExaminers] = useState([]);
const [reportSearch, setReportSearch] = useState({ name: "", module: "" });
const reportRef = useRef();

useEffect(() => {
fetchExaminers();
}, []);

const fetchExaminers = async () => {
try {
    const response = await api.get("/api/examiners");
    setExaminers(response.data);
} catch (error) {
    console.error("Error fetching examiners", error);
}
};

const filteredExaminersForReport = examiners.filter((examiner) => {
const matchesName = examiner.name.toLowerCase().includes(reportSearch.name.toLowerCase());
const matchesModule =
    reportSearch.module === "" ||
    examiner.module.some((m) => m.toLowerCase().includes(reportSearch.module.toLowerCase()));
return matchesName && matchesModule;
});

const handleReportSearchChange = (e) => {
const { name, value } = e.target;
setReportSearch((prev) => ({ ...prev, [name]: value }));
};

const generatePDF = () => {
const doc = new jsPDF();

doc.setFontSize(18);
doc.text("Examiners Report", 105, 15, { align: "center" });

doc.setFontSize(10);
doc.text(
    `Filters: Name - ${reportSearch.name || "All"}, Module - ${reportSearch.module || "All"}`,
    105,
    25,
    { align: "center" }
);

const headers = [["Examiner ID", "Name", "Email", "Modules"]];
const data = filteredExaminersForReport.map((examiner) => [
    examiner.examinerID,
    examiner.name,
    examiner.email,
    examiner.module.join(", "),
]);

autoTable(doc, {
    head: headers,
    body: data,
    startY: 30,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [0, 11, 88] },
});

doc.save("examiners_report.pdf");
};


const handlePrint = useReactToPrint({
content: () => reportRef.current,
});

return (
<div className="container mx-auto p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen rounded-2xl">
    <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
    Examiner Management
    </h1>

    {/* Report Section */}
    <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-8 mt-8">
    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Examiners Report</h2>

    {/* Report Filters */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <input
        type="text"
        name="name"
        value={reportSearch.name}
        onChange={handleReportSearchChange}
        placeholder="Search by name"
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
        type="text"
        name="module"
        value={reportSearch.module}
        onChange={handleReportSearchChange}
        placeholder="Search by module"
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div className="flex gap-2">
        <button
            onClick={generatePDF}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white flex-1"
        >
            Download PDF
        </button>
        </div>
    </div>

    {/* Report Table */}
    <div ref={reportRef} className="bg-white p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-center">Examiners Report</h3>
        <div className="mb-2 text-sm text-gray-600 text-center">
        {reportSearch.name && <span>Filtered by name: {reportSearch.name}</span>}
        {reportSearch.module && <span> | Filtered by module: {reportSearch.module}</span>}
        {!reportSearch.name && !reportSearch.module && <span>Showing all examiners</span>}
        </div>
        <table className="w-full table-auto border-collapse">
        <thead>
            <tr className="bg-gradient-to-r from-[#000B58] to-indigo-800 text-white">
            <th className="py-3 px-4 text-left">Examiner ID</th>
            <th className="py-3 px-4 text-left">Name</th>
            <th className="py-3 px-4 text-left">Email</th>
            <th className="py-3 px-4 text-left">Modules</th>
            </tr>
        </thead>
        <tbody>
            {filteredExaminersForReport.length > 0 ? (
            filteredExaminersForReport.map((examiner) => (
                <tr key={examiner._id} className="border-b hover:bg-gray-50/50">
                <td className="py-3 px-4">{examiner.examinerID}</td>
                <td className="py-3 px-4">{examiner.name}</td>
                <td className="py-3 px-4">{examiner.email}</td>
                <td className="py-3 px-4">{examiner.module.join(", ")}</td>
                </tr>
            ))
            ) : (
            <tr>
                <td colSpan="4" className="py-4 text-center text-gray-500">
                No examiners found matching your criteria
                </td>
            </tr>
            )}
        </tbody>
        </table>
        <div className="mt-4 text-sm text-gray-500 text-right">
        Generated on: {new Date().toLocaleString()}
        </div>
    </div>
    </div>
</div>
);
};

export default ExaminerReport;
