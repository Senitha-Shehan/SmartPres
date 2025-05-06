import React, { useState, useEffect } from "react";
import api from "../../lib/axios";
import { Link } from "react-router-dom";

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
  const [errors, setErrors] = useState({});

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

  const validateForm = () => {
    const newErrors = {};

    // Examiner ID validation
    if (!formData.examinerID.trim()) {
      newErrors.examinerID = "Examiner ID is required.";
    } else if (
      examiners.some(
        (examiner) =>
          examiner.examinerID === formData.examinerID && examiner._id !== editId
      )
    ) {
      newErrors.examinerID = "Examiner ID must be unique.";
    }

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      newErrors.name = "Name can only contain letters and spaces.";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters long.";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }

    // Modules validation
    if (!formData.module.length) {
      newErrors.module = "At least one module is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent non-letter characters in the name field
    if (name === "name" && !/^[A-Za-z\s]*$/.test(value)) {
      return; // Do not update the state if the input is invalid
    }

    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error when user types
  };

  const handleModuleChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      module: value.split(",").map((m) => m.trim()), // Store as an array
    }));
    setErrors((prev) => ({ ...prev, module: "" })); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Stop if validation fails

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
    <div className="container mx-auto p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen rounded-2xl">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
        Examiner Management
      </h1>

      {/* Add/Edit Examiner Form */}
      <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-8 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          {editId ? "Edit Examiner" : "Add Examiner"}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <input
              type="text"
              name="examinerID"
              value={formData.examinerID}
              onChange={handleChange}
              placeholder="Examiner ID"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            {errors.examinerID && (
              <p className="text-red-500 text-sm mt-1">{errors.examinerID}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="module"
              value={formData.module}
              onChange={handleModuleChange}
              placeholder="Modules (comma-separated)"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            {errors.module && (
              <p className="text-red-500 text-sm mt-1">{errors.module}</p>
            )}
          </div>
          <button
            type="submit"
            className="sm:col-span-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white"
          >
            {editId ? "Update Examiner" : "Add Examiner"}
          </button>
        </form>
      </div>

      {/* Examiner List */}
      <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Examiner List</h2>
        <div className="mb-4 flex items-center justify-between">
          <input
            type="text"
            placeholder="Search examiners..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-2/3 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-[#000B58] to-indigo-800 text-white">
              <th className="py-4 px-6 text-left rounded-tl-2xl">Examiner ID</th>
              <th className="py-4 px-6 text-left">Name</th>
              <th className="py-4 px-6 text-left">Email</th>
              <th className="py-4 px-6 text-left">Modules</th>
              <th className="py-4 px-6 text-left rounded-tr-2xl">Actions</th>
            </tr>
          </thead>
          <tbody>
            {examiners
              .filter((examiner) =>
                examiner.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((examiner) => (
                <tr key={examiner._id} className="border-b hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">{examiner.examinerID}</td>
                  <td className="py-4 px-6">{examiner.name}</td>
                  <td className="py-4 px-6">{examiner.email}</td>
                  <td className="py-4 px-6">{examiner.module.join(", ")}</td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleEdit(examiner)}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(examiner._id)}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className="flex justify-end mb-6">
          <Link to="/ExaminerReport">
            <button className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg shadow-md transition-all duration-300 transform hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Examiner Report
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Examiners;