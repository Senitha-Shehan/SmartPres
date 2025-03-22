import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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

  const location = useLocation();
  const { username } = location.state || {}; // Assuming username is the student's IT number
  const [modules, setModules] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [message, setMessage] = useState(""); // Message state
  const [errors, setErrors] = useState({}); // Validation errors
  const [existingMembers, setExistingMembers] = useState([]); // Track existing members
  const [existingModulesForUser, setExistingModulesForUser] = useState([]); // Track the user's registered modules
  const [userModules, setUserModules] = useState([]); // Store full module details

  useEffect(() => {
    if (!username) return;
  
    setFormData({ ...formData, leaderId: username });
  
    api.get("/api/groups")
      .then((res) => {
        const allMembers = res.data.flatMap(group => [
          group.leaderId, 
          ...group.members.map(member => member.memberId)
        ]);
        setExistingMembers(allMembers);
  
        // Filter the groups where the logged-in user is the leader
        const userGroups = res.data.filter(group => group.leaderId === username);
  
        setExistingModulesForUser(userGroups.map(group => group.moduleName)); // Keep only module names
        setUserModules(userGroups);  // Store full module details
      })
      .catch((err) => console.error("Error fetching groups", err));
  }, [username]);
  

  useEffect(() => {
    api.get("/api/modules")
      .then((res) => setModules(res.data))
      .catch((err) => console.error("Error fetching modules", err));
  }, []);

  useEffect(() => {
    if (formData.year && formData.semester) {
      const filtered = modules.filter(
        (m) =>
          parseInt(m.year) === parseInt(formData.year) &&
          parseInt(m.semester) === parseInt(formData.semester)
      );
      setFilteredModules(filtered);
    } else {
      setFilteredModules([]);
    }
  }, [formData.year, formData.semester, modules]);  // Ensure the filter is updated when form data changes

  const validateForm = () => {
    let newErrors = {};
  
    // Basic form validation
    if (!formData.moduleName.trim()) newErrors.moduleName = "Module Name is required";
    if (!formData.year.trim()) newErrors.year = "Year is required";
    if (!formData.semester.trim()) newErrors.semester = "Semester is required";
    if (!formData.leaderId.trim()) newErrors.leaderId = "Leader ID is required";
    if (!formData.leaderName.trim()) newErrors.leaderName = "Leader Name is required";
  
    formData.members.forEach((member, index) => {
      if (!member.memberId.trim()) newErrors[`memberId${index}`] = "Member ID is required";
      if (!member.memberName.trim()) newErrors[`memberName${index}`] = "Member Name is required";
  
      // Check if the member is already part of any other group for the same module
      const memberInGroup = existingMembers.some(existingMember => 
        existingMember.memberId === member.memberId && existingMember.moduleName === formData.moduleName
      );
      if (memberInGroup) {
        newErrors[`memberId${index}`] = "This IT number is already in another group for this module.";
      }
    });
  
    // Check if the leader is already part of another group for the same module
    const leaderInGroup = existingMembers.some(existingMember => 
      existingMember.memberId === formData.leaderId && existingMember.moduleName === formData.moduleName
    );
    if (leaderInGroup) {
      newErrors.leaderId = "This IT number is already a leader in another group for this module.";
    }
  
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

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Ensure the leader and members are not already registered in another group for this module
    const memberIds = [formData.leaderId, ...formData.members.map((member) => member.memberId)];

for (const memberId of memberIds) {
  const isMemberInModule = existingMembers.some(
    (existingMember) => existingMember.memberId === memberId && existingMember.moduleName === formData.moduleName
  );
  if (isMemberInModule) {
    setMessage("❌ One or more members are already part of a group for this module.");
    return;
  }
}

// Prevent registering for the same module twice
    if (existingModulesForUser.includes(formData.moduleName)) {
      setMessage("❌ You are already registered for this module.");
      return;
    }

    if (!validateForm()) return;

    try {
      await api.post("/api/groups", formData);
      setMessage("Group Registered Successfully ✅");

      setFormData({
        moduleName: "",
        year: "",
        semester: "",
        leaderId: username, // Reset leaderId to IT number for the next group
        leaderName: "",
        numberOfMembers: 1,
        members: [{ memberId: "", memberName: "" }],
      });
      setErrors({});
    } catch (error) {
      setMessage(error.response?.data?.error || "❌ Error registering group");
    }
  };
  

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">Welcome, {username}!</h1>
      <h2 className="text-2xl font-bold mb-4">Group Registration</h2>
      {message && <p className="mb-4 text-red-600 font-medium">{message}</p>}

      <form onSubmit={handleSubmit}>
        <label className="block text-lg font-semibold mb-2">Year</label>
        <select
          name="year"
          value={formData.year}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
        >
          <option value="">Select Year</option>
          {[1, 2, 3, 4].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <label className="block text-lg font-semibold mb-2">Semester</label>
        <select
          name="semester"
          value={formData.semester}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
        >
          <option value="">Select Semester</option>
          {[1, 2].map((sem) => (
            <option key={sem} value={sem}>
              {sem}
            </option>
          ))}
        </select>

        <label className="block text-lg font-semibold mb-2">Module Name</label>
        <select
          name="moduleName"
          value={formData.moduleName}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
        >
          <option value="">Select Module</option>
          {filteredModules.map((mod) => (
            <option key={mod.moduleCode} value={mod.moduleName}>
              {mod.moduleName}
            </option>
          ))}
        </select>

        <label className="block text-lg font-semibold mb-2">Leader Information</label>
        <input
          type="text"
          name="leaderId"
          placeholder="Leader ID"
          value={formData.leaderId}
          onChange={handleChange}
          className="w-full p-2 mb-2 border rounded"
          readOnly
        />
        <input
          type="text"
          name="leaderName"
          placeholder="Leader Name"
          value={formData.leaderName}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
        />

        <label className="block text-lg font-semibold mb-2">Number of Members</label>
        <input
          type="number"
          name="numberOfMembers"
          value={formData.numberOfMembers}
          onChange={(e) => handleChange(e)}
          className="w-full p-2 mb-4 border rounded"
          min="1"
          max="4"
        />

        {formData.members.map((member, index) => (
          <div key={index} className="mb-2">
            <input
              type="text"
              name="memberId"
              placeholder={`Member ${index + 1} ID`}
              value={member.memberId}
              onChange={(e) => handleChange(e, index)}
              className="w-full p-2 mb-1 border rounded"
            />
            <input
              type="text"
              name="memberName"
              placeholder={`Member ${index + 1} Name`}
              value={member.memberName}
              onChange={(e) => handleChange(e, index)}
              className="w-full p-2 border rounded"
            />
            {errors[`memberId${index}`] && (
              <p className="text-red-600">{errors[`memberId${index}`]}</p>
            )}
          </div>
        ))}

        <button
          type="submit"
          className="w-full p-2 mt-4 bg-blue-500 text-white rounded"
        >
          Register Group
        </button>
      </form>
      
      {userModules.length > 0 && (
  <div className="mb-6 p-4 bg-gray-100 rounded">
    <h2 className="text-xl font-semibold mb-2 text-gray-800">Registered Modules</h2>
    <div className="space-y-4">
      {userModules.map((mod, index) => (
        <div key={index} className="p-4 bg-white shadow rounded">
          <h3 className="text-lg font-bold text-gray-900">{mod.moduleName}</h3>
          <p className="text-sm text-gray-600"><strong>Module Code:</strong> {mod.moduleCode}</p>
          <p className="text-sm text-gray-600"><strong>Year:</strong> {mod.year}</p>
          <p className="text-sm text-gray-600"><strong>Semester:</strong> {mod.semester}</p>
          <p className="text-sm text-gray-600"><strong>Group ID:</strong> {mod.groupId}</p>
        </div>
      ))}
    </div>
  </div>
)}

    </div>
    
  );
};

export default GroupRegistration;
