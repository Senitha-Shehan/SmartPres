import React, { useState, useEffect } from "react";
import axios from "axios";

const AddModules = () => {
  const [formData, setFormData] = useState({
    year: "",
    semester: "",
    moduleCode: "",
    moduleName: "",
  });
  const [modules, setModules] = useState([]);
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/modules");
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
        await axios.put(`http://localhost:5000/api/modules/${editId}`, formData);
        setMessage("Module updated successfully");
      } else {
        await axios.post("http://localhost:5000/api/modules", formData);
        setMessage("Module added successfully");
      }
      setFormData({ year: "", semester: "", moduleCode: "", moduleName: "" });
      setEditId(null);
      fetchModules();
    } catch (error) {
      setMessage(error.response?.data?.error || "Something went wrong");
    }
  };

  const handleEdit = (module) => {
    setFormData(module);
    setEditId(module._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/modules/${id}`);
      setMessage("Module deleted successfully");
      fetchModules();
    } catch (error) {
      console.error("Error deleting module", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-25 p-8 bg-white shadow-lg rounded-lg border border-gray-300">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">
        {editId ? "Edit Module" : "Add Module"}
      </h2>
      {message && <p className="mb-4 text-green-600 font-medium text-center">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input type="number" name="year" placeholder="Year (1-4)" value={formData.year} onChange={handleChange} className="w-full p-3 border rounded-lg bg-gray-100" required />
          <input type="number" name="semester" placeholder="Semester (1-2)" value={formData.semester} onChange={handleChange} className="w-full p-3 border rounded-lg bg-gray-100" required />
        </div>
        <input type="text" name="moduleCode" placeholder="Module Code" value={formData.moduleCode} onChange={handleChange} className="w-full p-3 border rounded-lg bg-gray-100" required />
        <input type="text" name="moduleName" placeholder="Module Name" value={formData.moduleName} onChange={handleChange} className="w-full p-3 border rounded-lg bg-gray-100" required />
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-medium transition duration-300">
          {editId ? "Update Module" : "Add Module"}
        </button>
      </form>

      <h3 className="text-2xl font-semibold mt-10 text-center">Module List</h3>
      <div className="overflow-x-auto mt-6">
        <table className="table w-full border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr className="bg-blue-100">
              <th></th>
              <th>Year</th>
              <th>Semester</th>
              <th>Module Code</th>
              <th>Module Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {modules.map((module, index) => (
              <tr key={module._id} className="hover:bg-gray-100 transition duration-200">
                <th>{index + 1}</th>
                <td className="text-center">{module.year}</td>
                <td className="text-center">{module.semester}</td>
                <td className="text-center font-semibold text-gray-800">{module.moduleCode}</td>
                <td className="text-center">{module.moduleName}</td>
                <td className="text-center flex justify-center space-x-2">
                  <button onClick={() => handleEdit(module)} className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition duration-300">Edit</button>
                  <button onClick={() => handleDelete(module._id)} className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded-lg transition duration-300">Delete</button>
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
