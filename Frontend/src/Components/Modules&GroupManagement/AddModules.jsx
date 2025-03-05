import React, { useState } from "react";
import axios from "axios";

const AddModules = () => {
  const [formData, setFormData] = useState({
    year: "",
    semester: "",
    moduleCode: "",
    moduleName: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "year" && (value < 1 || value > 4)) return;
    if (name === "semester" && (value < 1 || value > 2)) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/modules", formData);
      setMessage(response.data.message);
      setFormData({ year: "", semester: "", moduleCode: "", moduleName: "" });
    } catch (error) {
      setMessage(error.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-800 text-white rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Add Module</h2>
      {message && <p className="mb-4 text-green-500">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          name="year"
          placeholder="Year (1-4)"
          value={formData.year}
          onChange={handleChange}
          className="w-full p-2 border rounded bg-gray-700 text-white"
          required
        />
        <input
          type="number"
          name="semester"
          placeholder="Semester (1-2)"
          value={formData.semester}
          onChange={handleChange}
          className="w-full p-2 border rounded bg-gray-700 text-white"
          required
        />
        <input
          type="text"
          name="moduleCode"
          placeholder="Module Code"
          value={formData.moduleCode}
          onChange={handleChange}
          className="w-full p-2 border rounded bg-gray-700 text-white"
          required
        />
        <input
          type="text"
          name="moduleName"
          placeholder="Module Name"
          value={formData.moduleName}
          onChange={handleChange}
          className="w-full p-2 border rounded bg-gray-700 text-white"
          required
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded"
        >
          Add Module
        </button>
      </form>
    </div>
  );
};

export default AddModules;
