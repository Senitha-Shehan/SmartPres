import React, { useState, useEffect } from "react";
import api from "../../lib/axios";

const Examiners = () => {
  const [formData, setFormData] = useState({
    examinerID: "",
    name: "",
    module: [],
    email: "",
  });
  const [examiners, setExaminers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleModuleChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      module: value.split(",").map((m) => m.trim()), // Store as an array
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/api/examiners/${editId}`, formData);
      } else {
        await api.post("/api/examiners", formData);
      }
      setFormData({ examinerID: "", name: "", module: [], email: "" });
      setEditId(null);
      fetchExaminers();
    } catch (error) {
      console.error("Error saving examiner", error);
    }
  };

  const handleEdit = (examiner) => {
    setFormData({
      ...examiner,
      module: examiner.module.join(", "), // Convert array to a comma-separated string
    });
    setEditId(examiner._id);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/examiners/${id}`);
      fetchExaminers();
    } catch (error) {
      console.error("Error deleting examiner", error);
    }
  };

  return (
    <div className="container mx-auto p-8" style={{ backgroundColor: '#e7ecef' }}>
      <h1 className="text-3xl font-bold text-center mb-6" style={{ color: '#1d3557' }}>
        Examiner Management
      </h1>
  
      {/* Add/Edit Examiner Form */}
      <div className="shadow-lg rounded-lg p-6 mb-8" style={{ backgroundColor: '#a8dadc' }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: '#1d3557' }}>
          {editId ? "Edit Examiner" : "Add Examiner"}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          <input
            type="text"
            name="examinerID"
            value={formData.examinerID}
            onChange={handleChange}
            placeholder="Examiner ID"
            className="border-2 border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-457b9d"
            style={{ backgroundColor: '#e7ecef', color: '#1d3557' }}
            required
          />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="border-2 border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-457b9d"
            style={{ backgroundColor: '#e7ecef', color: '#1d3557' }}
            required
          />
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="border-2 border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-457b9d"
            style={{ backgroundColor: '#e7ecef', color: '#1d3557' }}
            required
          />
          <input
            type="text"
            name="module"
            value={formData.module}
            onChange={handleModuleChange}
            placeholder="Modules (comma-separated)"
            className="border-2 border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-457b9d"
            style={{ backgroundColor: '#e7ecef', color: '#1d3557' }}
            required
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-md sm:col-span-2"
            style={{ backgroundColor: '#457b9d', color: '#e7ecef' }}
          >
            {editId ? "Update Examiner" : "Add Examiner"}
          </button>
        </form>
      </div>
  
      {/* Examiner List */}
      <div className="shadow-lg rounded-lg p-6" style={{ backgroundColor: '#a8dadc' }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: '#1d3557' }}>
          Examiner List
        </h2>
        <div className="mb-4 flex items-center justify-between">
          <input
            type="text"
            placeholder="Search examiners..."
            className="border-2 border-gray-300 p-3 w-2/3 rounded-md focus:ring-2 focus:ring-457b9d"
            style={{ backgroundColor: '#e7ecef', color: '#1d3557' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <table className="w-full table-auto">
          <thead>
            <tr style={{ backgroundColor: '#457b9d', color: '#e7ecef' }}>
              <th className="py-3 px-6 text-left">Examiner ID</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Modules</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {examiners
              .filter((examiner) =>
                examiner.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((examiner) => (
                <tr key={examiner._id} className="border-b hover:bg-gray-50" style={{ color: '#1d3557' }}>
                  <td className="py-3 px-6">{examiner.examinerID}</td>
                  <td className="py-3 px-6">{examiner.name}</td>
                  <td className="py-3 px-6">{examiner.email}</td>
                  <td className="py-3 px-6">{examiner.module.join(", ")}</td>
                  <td className="py-3 px-6">
                    <button
                      onClick={() => handleEdit(examiner)}
                      className="px-4 py-2 rounded-md transition-colors mr-2"
                      style={{ backgroundColor: '#457b9d', color: '#e7ecef' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(examiner._id)}
                      className="px-4 py-2 rounded-md transition-colors"
                      style={{ backgroundColor: '#1d3557', color: '#e7ecef' }}
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

export default Examiners;
