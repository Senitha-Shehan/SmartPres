import React, { useEffect, useState } from "react";
import api from "../../lib/axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ModuleReport = () => {
const [modules, setModules] = useState([]);
const [filteredModules, setFilteredModules] = useState([]);
const [yearFilter, setYearFilter] = useState("");
const [semesterFilter, setSemesterFilter] = useState("");
const [search, setSearch] = useState("");

const years = [1, 2, 3, 4];
const semesters = [1, 2];

useEffect(() => {
fetchModules();
}, []);

useEffect(() => {
applyFilters();
}, [modules, yearFilter, semesterFilter, search]);

const fetchModules = async () => {
try {
    const res = await api.get("/api/modules");
    setModules(res.data);
} catch (error) {
    console.error("Error fetching modules", error);
}
};

const applyFilters = () => {
let result = modules;

if (yearFilter) {
    result = result.filter((mod) => mod.year.toString() === yearFilter);
}
if (semesterFilter) {
    result = result.filter((mod) => mod.semester.toString() === semesterFilter);
}
if (search.trim()) {
    result = result.filter((mod) =>
    mod.moduleName.toLowerCase().includes(search.toLowerCase())
    );
}

setFilteredModules(result);
};

const generatePDF = () => {
const doc = new jsPDF();

doc.setFontSize(18);
doc.text("Modules Report", 105, 15, { align: "center" });

doc.setFontSize(10);
doc.text(
    `Filters: Year - ${yearFilter || "All"}, Semester - ${semesterFilter || "All"}, Search - ${search || "None"}`,
    105,
    25,
    { align: "center" }
);

const headers = [["Year", "Semester", "Module Code", "Module Name"]];
const data = filteredModules.map((mod) => [
    mod.year,
    mod.semester,
    mod.moduleCode,
    mod.moduleName,
]);

autoTable(doc, {
    head: headers,
    body: data,
    startY: 30,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [0, 11, 88] },
});

doc.save("modules_report.pdf");
};

return (
<div className="p-8 bg-gray-100 min-h-screen rounded-lg">
    <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Module Report</h1>

    {/* Filters */}
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
    <select
        className="p-3 border rounded-md"
        value={yearFilter}
        onChange={(e) => setYearFilter(e.target.value)}
    >
        <option value="">All Years</option>
        {years.map((y) => (
        <option key={y} value={y}>Year {y}</option>
        ))}
    </select>

    <select
        className="p-3 border rounded-md"
        value={semesterFilter}
        onChange={(e) => setSemesterFilter(e.target.value)}
    >
        <option value="">All Semesters</option>
        {semesters.map((s) => (
        <option key={s} value={s}>Semester {s}</option>
        ))}
    </select>

    <input
        type="text"
        placeholder="Search by module name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-3 border rounded-md w-full md:w-1/3"
    />

    <button
        onClick={generatePDF}
        className="px-4 py-2 rounded-md bg-indigo-700 text-white hover:bg-indigo-800 transition"
    >
        Download PDF
    </button>
    </div>

    {/* Table */}
    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
    <table className="min-w-full table-auto">
        <thead className="bg-indigo-800 text-white">
        <tr>
            <th className="p-3 text-left">Year</th>
            <th className="p-3 text-left">Semester</th>
            <th className="p-3 text-left">Module Code</th>
            <th className="p-3 text-left">Module Name</th>
        </tr>
        </thead>
        <tbody>
        {filteredModules.length === 0 ? (
            <tr>
            <td colSpan="4" className="p-4 text-center text-gray-500">
                No modules found
            </td>
            </tr>
        ) : (
            filteredModules.map((mod) => (
            <tr key={mod._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{mod.year}</td>
                <td className="p-3">{mod.semester}</td>
                <td className="p-3">{mod.moduleCode}</td>
                <td className="p-3">{mod.moduleName}</td>
            </tr>
            ))
        )}
        </tbody>
    </table>
    </div>
</div>
);
};

export default ModuleReport;
