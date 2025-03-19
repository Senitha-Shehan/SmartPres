import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../../lib/axios";

const ExaminerDashboard = () => {
  const location = useLocation();
  const { username } = location.state || {}; 
  const [presentations, setPresentations] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/api/presentations")
      .then((res) => {
        const filteredPresentations = res.data.filter(
          (presentation) => presentation.examiner === username
        );
        setPresentations(filteredPresentations);
      })
      .catch((err) => console.error("Error fetching presentations", err));
  }, [username]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/api/presentations/${id}`, { status: newStatus });
      setMessage("Presentation status updated successfully");

      setPresentations((prevPresentations) =>
        prevPresentations.map((presentation) =>
          presentation._id === id
            ? { ...presentation, status: newStatus }
            : presentation
        )
      );
    } catch (error) {
      console.error("Error updating presentation status", error);
      setMessage("Error updating presentation status");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg border border-gray-300">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">Welcome, {username}!</h1>
      {message && <p className="mb-4 text-center text-green-600 font-medium">{message}</p>}
      <h3 className="text-2xl font-semibold mt-10 text-center">Scheduled Presentations</h3>
      <div className="overflow-x-auto mt-6">
        <table className="w-full table-auto border-collapse border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr className="bg-blue-100">
              <th className="p-3 border-b">Year</th>
              <th className="p-3 border-b">Semester</th>
              <th className="p-3 border-b">Module</th>
              <th className="p-3 border-b">Examiner</th>
              <th className="p-3 border-b">Date</th>
              <th className="p-3 border-b">Duration</th>
              <th className="p-3 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {presentations.length > 0 ? (
              presentations.map((presentation) => (
                <tr key={presentation._id} className="hover:bg-gray-100 transition duration-200">
                  <td className="p-3 border-b text-center">{presentation.year}</td>
                  <td className="p-3 border-b text-center">{presentation.semester}</td>
                  <td className="p-3 border-b text-center">{presentation.module}</td>
                  <td className="p-3 border-b text-center">{presentation.examiner}</td>
                  <td className="p-3 border-b text-center">{presentation.date}</td>
                  <td className="p-3 border-b text-center">{presentation.duration} mins</td>
                  <td className="p-3 border-b text-center">
                    <select
                      value={presentation.status}
                      onChange={(e) => handleStatusChange(presentation._id, e.target.value)}
                      className="border p-2 rounded-lg bg-gray-100"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-4">No presentations available for this examiner.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExaminerDashboard;
