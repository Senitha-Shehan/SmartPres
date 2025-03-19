import React, { useState } from "react";
import api from "../../lib/axios"; // Import API instance

const GroupRegistration = () => {
  const [formData, setFormData] = useState({
    moduleName: "",
    year: "",
    semester: "",
    leaderId: "",
    leaderName: "",
    numberOfMembers: 1,
    members: [{ memberId: "", memberName: "" }],
  });

  const [message, setMessage] = useState(""); // Message state
  const [errors, setErrors] = useState({}); // Validation errors

  const validateForm = () => {
    let newErrors = {};
    if (!formData.moduleName.trim()) newErrors.moduleName = "Module Name is required";
    if (!formData.year.trim()) newErrors.year = "Year is required";
    if (!formData.semester.trim()) newErrors.semester = "Semester is required";
    if (!formData.leaderId.trim()) newErrors.leaderId = "Leader ID is required";
    if (!formData.leaderName.trim()) newErrors.leaderName = "Leader Name is required";

    formData.members.forEach((member, index) => {
      if (!member.memberId.trim()) newErrors[`memberId${index}`] = "Member ID is required";
      if (!member.memberName.trim()) newErrors[`memberName${index}`] = "Member Name is required";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;
    if (index !== null) {
      const updatedMembers = [...formData.members];
      updatedMembers[index][name] = value;
      setFormData({ ...formData, members: updatedMembers });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleMemberCountChange = (e) => {
    const count = parseInt(e.target.value, 10);
    setFormData({
      ...formData,
      numberOfMembers: count,
      members: Array.from({ length: count }, () => ({ memberId: "", memberName: "" })),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await api.post("/api/groups", formData);
      setMessage("Group Registered Successfully ✅");
      console.log(response.data);

      setFormData({
        moduleName: "",
        year: "",
        semester: "",
        leaderId: "",
        leaderName: "",
        numberOfMembers: 1,
        members: [{ memberId: "", memberName: "" }],
      });
      setErrors({});
    } catch (error) {
      setMessage(error.response?.data?.error || "❌ Error registering group");
      console.error("Error registering group", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Group Registration</h2>
      {message && <p className="mb-4 text-red-600 font-medium">{message}</p>}

      <form onSubmit={handleSubmit}>
        <input type="text" name="moduleName" placeholder="Module Name" value={formData.moduleName} onChange={handleChange} className="w-full p-2 mb-2 border rounded" required />
        
        <label className="block text-lg font-semibold mb-2">Year</label>
        <select name="year" value={formData.year} onChange={handleChange} className="w-full p-2 mb-4 border rounded" required>
          <option value="">Select Year</option>
          {[1, 2, 3, 4].map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        
        <label className="block text-lg font-semibold mb-2">Semester</label>
        <select name="semester" value={formData.semester} onChange={handleChange} className="w-full p-2 mb-4 border rounded" required>
          <option value="">Select Semester</option>
          {[1, 2].map((sem) => (
            <option key={sem} value={sem}>{sem}</option>
          ))}
        </select>

        <input type="text" name="leaderId" placeholder="Leader ID" value={formData.leaderId} onChange={handleChange} className="w-full p-2 mb-2 border rounded" required />
        <input type="text" name="leaderName" placeholder="Leader Name" value={formData.leaderName} onChange={handleChange} className="w-full p-2 mb-4 border rounded" required />
        
        <label className="block text-lg font-semibold mb-2">Number of Members</label>
        <select name="numberOfMembers" value={formData.numberOfMembers} onChange={handleMemberCountChange} className="w-full p-2 mb-4 border rounded">
          {[1, 2, 3, 4].map((num) => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>

        {formData.members.map((member, index) => (
          <div key={index} className="mb-2">
            <input type="text" name="memberId" placeholder={`Member ${index + 1} ID`} value={member.memberId} onChange={(e) => handleChange(e, index)} className="w-full p-2 mb-1 border rounded" required />
            <input type="text" name="memberName" placeholder={`Member ${index + 1} Name`} value={member.memberName} onChange={(e) => handleChange(e, index)} className="w-full p-2 border rounded" required />
          </div>
        ))}

        <button type="submit" className="w-full p-2 mt-4 bg-blue-500 text-white rounded">Register Group</button>
      </form>
    </div>
  );
};

export default GroupRegistration;
