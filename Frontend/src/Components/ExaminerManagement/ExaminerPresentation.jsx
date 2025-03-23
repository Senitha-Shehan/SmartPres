import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../../lib/axios";

const ExaminerPresentation = () => {
  const location = useLocation();
  const { username } = location.state || {}; // Retrieve username from navigation state
  const [presentations, setPresentations] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!username) return;

    api.get("/api/presentations")
      .then((res) => {
        const filtered = res.data.filter(
          (presentation) => presentation.examiner === username
        );
        setPresentations(filtered);
      })
      .catch((err) => console.error("Error fetching presentations", err));
  }, [username]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/api/presentations/${id}`, { status: newStatus });
      setMessage("Presentation status updated successfully");
      setPresentations((prev) =>
        prev.map((presentation) =>
          presentation._id === id ? { ...presentation, status: newStatus } : presentation
        )
      );
    } catch (error) {
      console.error("Error updating presentation status", error);
      setMessage("Error updating presentation status");
    }
  };

  // Function to get the background color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"; // Yellow for pending
      case "approved":
        return "bg-green-100 text-green-800 hover:bg-green-200"; // Green for approved
      case "rejected":
        return "bg-red-100 text-red-800 hover:bg-red-200"; // Red for rejected
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"; // Default gray
    }
  };

  return (
    <div className="container mx-auto p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen rounded-2xl">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
        Welcome, {username}!
      </h1>
      {message && (
        <p className="mb-4 text-center text-green-600 font-medium">{message}</p>
      )}
      <h3 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Scheduled Presentations
      </h3>
      <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-8">
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-[#000B58] to-indigo-800 text-white">
                <th className="py-4 px-6 text-left rounded-tl-2xl">Year</th>
                <th className="py-4 px-6 text-left">Semester</th>
                <th className="py-4 px-6 text-left">Module</th>
                <th className="py-4 px-6 text-left">Date</th>
                <th className="py-4 px-6 text-left">Duration</th>
                <th className="py-4 px-6 text-left rounded-tr-2xl">Status</th>
              </tr>
            </thead>
            <tbody>
              {presentations.length > 0 ? (
                presentations.map((presentation) => (
                  <tr
                    key={presentation._id}
                    className="border-b hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-4 px-6">{presentation.year}</td>
                    <td className="py-4 px-6">{presentation.semester}</td>
                    <td className="py-4 px-6">{presentation.module}</td>
                    <td className="py-4 px-6">{presentation.date}</td>
                    <td className="py-4 px-6">{presentation.duration} mins</td>
                    <td className="py-4 px-6">
                      <select
                        value={presentation.status}
                        onChange={(e) =>
                          handleStatusChange(presentation._id, e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out ${getStatusColor(
                          presentation.status
                        )}`}
                      >
                        <option
                          value="pending"
                          className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                        >
                          Pending
                        </option>
                        <option
                          value="approved"
                          className="bg-green-100 text-green-800 hover:bg-green-200"
                        >
                          Approved
                        </option>
                        <option
                          value="rejected"
                          className="bg-red-100 text-red-800 hover:bg-red-200"
                        >
                          Rejected
                        </option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-6 text-gray-600"
                  >
                    No presentations available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExaminerPresentation;