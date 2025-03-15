import React, { useState, useEffect } from "react";
import api from "../../lib/axios";
// import jsPDF from "jspdf";

const AddModules = () => {
  const [formData, setFormData] = useState({
    year: "",
    semester: "",
    moduleCode: "",
    moduleName: "",
  });
  const [modules, setModules] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const response = await api.get("/api/modules");
      setModules(response.data);
    } catch (error) {
      console.error("Error fetching modules", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/api/modules/${editId}`, formData);
      } else {
        await api.post("/api/modules", formData);
      }
      setFormData({ year: "", semester: "", moduleCode: "", moduleName: "" });
      setEditId(null);
      fetchModules();
    } catch (error) {
      console.error("Error saving module", error);
    }
  };

  const handleEdit = (module) => {
    setFormData(module);
    setEditId(module._id);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/modules/${id}`);
      fetchModules();
    } catch (error) {
      console.error("Error deleting module", error);
    }
  };

  const generateReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Module List Report", 20, 20);
    doc.setFontSize(12);
    let yPosition = 30;

    doc.text("Year | Semester | Module Code | Module Name", 20, yPosition);
    yPosition += 10;

    modules.forEach((module) => {
      doc.text(
        `${module.year} | ${module.semester} | ${module.moduleCode} | ${module.moduleName}`,
        20,
        yPosition
      );
      yPosition += 10;
    });

    doc.save("module_report.pdf");
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Module Management
      </h1>

      {/* Add/Edit Module Form */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Add or Edit Module
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            placeholder="Year"
            className="border-2 border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="number"
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            placeholder="Semester"
            className="border-2 border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="text"
            name="moduleCode"
            value={formData.moduleCode}
            onChange={handleChange}
            placeholder="Module Code"
            className="border-2 border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="text"
            name="moduleName"
            value={formData.moduleName}
            onChange={handleChange}
            placeholder="Module Name"
            className="border-2 border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <button
            type="submit"
            className="btn btn-primary px-0 py-2 rounded-md sm:col-span-2"
          >
            {editId ? "Update Module" : "Add Module"}
          </button>
        </form>
      </div>

      {/* Module List */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Module List
        </h2>
        <div className="mb-4 flex items-center justify-between">
          <input
            type="text"
            placeholder="Search modules..."
            className="border-2 border-gray-300 p-3 w-2/3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-indigo-100 text-gray-700">
              <th className="py-3 px-6 text-left">Year</th>
              <th className="py-3 px-6 text-left">Semester</th>
              <th className="py-3 px-6 text-left">Module Code</th>
              <th className="py-3 px-6 text-left">Module Name</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {modules
              .filter((module) =>
                module.moduleName.toLowerCase().includes(search.toLowerCase())
              )
              .map((module) => (
                <tr key={module._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6">{module.year}</td>
                  <td className="py-3 px-6">{module.semester}</td>
                  <td className="py-3 px-6">{module.moduleCode}</td>
                  <td className="py-3 px-6">{module.moduleName}</td>
                  <td className="py-3 px-6">
                    <button
                      onClick={() => handleEdit(module)}
                      className="btn btn-soft btn-primary px-4 py-2 rounded-md transition-colors mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(module._id)}
                      className="btn btn-soft btn-error px-4 py-2 rounded-md transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddModules;
