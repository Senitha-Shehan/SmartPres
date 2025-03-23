import React, { useState, useEffect } from "react";
import api from "../../lib/axios";
// import jsPDF from "jspdf";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [errors, setErrors] = useState({
    moduleCode: "",
    moduleName: "",
    duplicate: "",
  });

  // Year and Semester options
  const years = [1, 2, 3, 4]; // Years 1 to 4
  const semesters = [1, 2]; // Semester 1 and Semester 2

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const response = await api.get("/api/modules");
      setModules(response.data);
    } catch (error) {
      console.error("Error fetching modules", error);
      toast.error("Failed to fetch modules. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { moduleCode: "", moduleName: "", duplicate: "" };

    // Validate moduleCode (should start with "IT" and followed by 4 numbers)
    const moduleCodeRegex = /^IT\d{4}$/;
    if (!moduleCodeRegex.test(formData.moduleCode)) {
      newErrors.moduleCode = "Module Code must begin with 'IT' followed by 4 numbers.";
      valid = false;
    }

    // Validate moduleName (should only contain letters)
    const moduleNameRegex = /^[A-Za-z\s]+$/;
    if (!moduleNameRegex.test(formData.moduleName)) {
      newErrors.moduleName = "Module Name must only contain letters.";
      valid = false;
    }

    // Check for duplicate module code and name
    const duplicateModule = modules.find(
      (module) =>
        module.moduleCode === formData.moduleCode && module.moduleName === formData.moduleName
    );
    if (duplicateModule) {
      newErrors.duplicate = "This Module Code and Name already exist!";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Don't submit if form is invalid
    }

    try {
      if (editId) {
        await api.put(`/api/modules/${editId}`, formData);
        toast.success("Module updated successfully!");
      } else {
        await api.post("/api/modules", formData);
        toast.success("Module added successfully!");
      }
      setFormData({ year: "", semester: "", moduleCode: "", moduleName: "" });
      setEditId(null);
      setErrors({ moduleCode: "", moduleName: "", duplicate: "" });
      fetchModules();
    } catch (error) {
      console.error("Error saving module", error);
      toast.error("Failed to save module. Please try again.");
    }
  };

  const handleEdit = (module) => {
    setFormData(module);
    setEditId(module._id);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/modules/${id}`);
      toast.success("Module deleted successfully!");
      fetchModules();
    } catch (error) {
      console.error("Error deleting module", error);
      toast.error("Failed to delete module. Please try again.");
    }
  };


  return (
    <div className="container p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen rounded-2xl">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Module Management</h1>

      {/* Add/Edit Module Form */}
      <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Add or Edit Module</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <select
            name="year"
            value={formData.year}
            onChange={handleChange}
            className="border-2 border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="">Select Year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                Year {year}
              </option>
            ))}
          </select>

          <select
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            className="border-2 border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="">Select Semester</option>
            {semesters.map((semester) => (
              <option key={semester} value={semester}>
                Semester {semester}
              </option>
            ))}
          </select>

          <div>
            <input
              type="text"
              name="moduleCode"
              value={formData.moduleCode}
              onChange={handleChange}
              placeholder="Module Code"
              className="border-2 border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            {errors.moduleCode && (
              <p className="text-red-500 text-sm">{errors.moduleCode}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              name="moduleName"
              value={formData.moduleName}
              onChange={handleChange}
              placeholder="Module Name"
              className="border-2 border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            {errors.moduleName && (
              <p className="text-red-500 text-sm">{errors.moduleName}</p>
            )}
          </div>

          {errors.duplicate && (
            <p className="text-red-500 text-sm">{errors.duplicate}</p>
          )}

          <button
            type="submit"
            className="btn btn-primary px-0 py-2 rounded-md sm:col-span-2"
          >
            {editId ? "Update Module" : "Add Module"}
          </button>
        </form>
      </div>

      {/* Module List */}
      <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Module List</h2>
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
            <tr className="bg-gradient-to-r from-[#000B58] to-indigo-800 text-white">
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
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(module._id)}
                      className="btn btn-soft btn-error px-4 py-2 rounded-md transition-colors"
                    >
                      Remove
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