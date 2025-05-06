import { useState, useEffect, useRef } from "react";
import api from "../../lib/axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const PresentationScheduleReport = () => {
  const [presentations, setPresentations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPresentations, setFilteredPresentations] = useState([]);
  const reportRef = useRef();

  useEffect(() => {
    api.get("/api/presentations")
      .then((res) => setPresentations(res.data))
      .catch((err) => console.error("Error fetching presentations", err));
  }, []);

  useEffect(() => {
    const filtered = presentations.filter((presentation) => {
      const matchesYear = searchQuery ? presentation.year.toString().includes(searchQuery) : true;
      const matchesModule = searchQuery ? presentation.module.toLowerCase().includes(searchQuery.toLowerCase()) : true;
      return matchesYear || matchesModule;
    });
    setFilteredPresentations(filtered);
  }, [searchQuery, presentations]);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Presentation Schedule Report", 105, 15, { align: "center" });

    doc.setFontSize(10);
    doc.text(`Search Filter: ${searchQuery || "None"}`, 105, 25, { align: "center" });

    const headers = [["Year", "Semester", "Module", "Examiner", "Date", "Duration", "Status"]];
    const data = filteredPresentations.map((p) => [
      p.year,
      p.semester,
      p.module,
      p.examiner,
      new Date(p.date).toLocaleDateString(),
      `${p.duration} mins`,
      p.status,
    ]);

    autoTable(doc, {
      head: headers,
      body: data,
      startY: 30,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [0, 11, 88] },
    });

    doc.save("presentation_schedule_report.pdf");
  };

  return (
    <div className="container mx-auto p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen rounded-2xl">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">Presentation Schedule Report</h1>

      <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-8">
        {/* Filter + Download */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Year or Module"
            className="w-full sm:w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={generatePDF}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white"
          >
            Download PDF
          </button>
        </div>

        <div ref={reportRef} className="bg-white p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-center">Scheduled Presentations</h3>
          <div className="mb-2 text-sm text-gray-600 text-center">
            {searchQuery ? `Filtered by: "${searchQuery}"` : "Showing all presentations"}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-[#000B58] to-indigo-800 text-white">
                  <th className="py-3 px-4 text-left">Year</th>
                  <th className="py-3 px-4 text-left">Semester</th>
                  <th className="py-3 px-4 text-left">Module</th>
                  <th className="py-3 px-4 text-left">Examiner</th>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Duration</th>
                  <th className="py-3 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredPresentations.length > 0 ? (
                  filteredPresentations.map((p) => (
                    <tr key={p._id} className="border-b hover:bg-gray-50/50">
                      <td className="py-3 px-4">{p.year}</td>
                      <td className="py-3 px-4">{p.semester}</td>
                      <td className="py-3 px-4">{p.module}</td>
                      <td className="py-3 px-4">{p.examiner}</td>
                      <td className="py-3 px-4">{new Date(p.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4">{p.duration} mins</td>
                      <td className="py-3 px-4">{p.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-4 text-center text-gray-500">
                      No presentations found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-sm text-gray-500 text-right">
            Generated on: {new Date().toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresentationScheduleReport;
