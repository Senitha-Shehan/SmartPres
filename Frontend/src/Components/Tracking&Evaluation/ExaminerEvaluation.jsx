import React, { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import axios from "../../lib/axios";

const ExaminerEvaluation = () => {
  const location = useLocation();
  const examinerUsername = location.state?.username || "Unknown Examiner";

  const [groups, setGroups] = useState([]);
  const [examiners, setExaminers] = useState([]);
  const [evaluations, setEvaluations] = useState({});
  const [submittedEvaluations, setSubmittedEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [groupsRes, examinersRes] = await Promise.all([
          axios.get("/api/groups"),
          axios.get("/api/examiners"),
        ]);
        setGroups(groupsRes.data);
        setExaminers(examinersRes.data);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchSubmittedEvaluations = async () => {
      try {
        const response = await axios.get("/api/evaluation"); // Fetch evaluations from DB
        setSubmittedEvaluations(response.data);
        const newEvaluations = {};
        response.data.forEach((evalItem) => {
          newEvaluations[evalItem.groupID] = {
            marks: evalItem.marks,
            remarks: evalItem.remarks,
            submitted: true,
          };
        });
        setEvaluations(newEvaluations);
      } catch (err) {
        console.error("Error fetching submitted evaluations", err);
      }
    };

    fetchData();
    fetchSubmittedEvaluations(); // Load submitted evaluations on mount
  }, []);

  const loggedExaminer = examiners.find((examiner) => examiner.name === examinerUsername);
  const filteredGroups = loggedExaminer
    ? groups.filter((group) => loggedExaminer.module.includes(group.moduleName))
    : [];

  const handleInputChange = (groupId, field, value) => {
    if (field === "marks" && (value < 0 || value > 100)) {
      alert("Marks should be between 0 and 100.");
      return;
    }

    setEvaluations((prev) => ({
      ...prev,
      [groupId]: { ...prev[groupId], [field]: value },
    }));
  };

  const handleSubmitEvaluation = useCallback(async (groupId) => {
    const evaluation = evaluations[groupId];
    if (!evaluation || evaluation.marks === undefined || evaluation.marks === "") {
      alert("Please enter valid marks before submitting.");
      return;
    }

    if (!window.confirm("Are you sure you want to submit this evaluation?")) return;

    setSubmitting(true);
    try {
      const moduleName = Array.isArray(loggedExaminer.module)
        ? loggedExaminer.module.join(", ")
        : loggedExaminer.module;

      await axios.post("/api/evaluation", {
        groupID: groupId,
        moduleName,
        examinerID: loggedExaminer.examinerID,
        marks: evaluation.marks,
        remarks: evaluation.remarks || "",
      });

      setSubmittedEvaluations((prev) => [...prev, { groupId, ...evaluation }]);
      setEvaluations((prev) => ({
        ...prev,
        [groupId]: { ...prev[groupId], submitted: true },
      }));
    } catch (error) {
      alert("Error saving evaluation. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [evaluations, loggedExaminer]);

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Examiner Evaluation</h2>
      <p className="text-center text-lg mb-4">
        Logged in as: <span className="font-semibold text-indigo-600">{examinerUsername}</span>
      </p>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Assigned Groups</h3>
            <table className="w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-indigo-100 text-gray-700">
                  <th className="py-3 px-6 border">Group ID</th>
                  <th className="py-3 px-6 border">Module</th>
                  <th className="py-3 px-6 border">Marks</th>
                  <th className="py-3 px-6 border">Remarks</th>
                  <th className="py-3 px-6 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredGroups.map((group) => {
                  const evaluation = evaluations[group.groupId] || {};
                  return (
                    <tr key={group.groupId} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-6 border">{group.groupId}</td>
                      <td className="py-3 px-6 border">{group.moduleName}</td>
                      <td className="py-3 px-6 border">
                        <input
                          type="number"
                          value={evaluation.marks || ""}
                          onChange={(e) => handleInputChange(group.groupId, "marks", e.target.value)}
                          className="px-4 py-2 border rounded-md"
                          min="0"
                          max="100"
                          disabled={evaluation.submitted}
                        />
                      </td>
                      <td className="py-3 px-6 border">
                        <input
                          type="text"
                          value={evaluation.remarks || ""}
                          onChange={(e) => handleInputChange(group.groupId, "remarks", e.target.value)}
                          className="px-4 py-2 border rounded-md"
                          disabled={evaluation.submitted}
                        />
                      </td>
                      <td className="py-3 px-6 border">
                        <button
                          onClick={() => handleSubmitEvaluation(group.groupId)}
                          className={`px-4 py-2 rounded-md text-white transition ${
                            evaluation.submitted ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                          }`}
                          disabled={evaluation.submitted || submitting}
                        >
                          {evaluation.submitted ? "Submitted ✅" : "Submit"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Submitted Evaluations</h3>
            <ul>
              {submittedEvaluations.map((evalItem, index) => (
                <li key={index} className="border-b py-2">
                  Group ID: {evalItem.groupID} - Marks: {evalItem.marks} - Remarks: {evalItem.remarks}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default ExaminerEvaluation;
