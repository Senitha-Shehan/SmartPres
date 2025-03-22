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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState(null);

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
        const response = await axios.get("/api/evaluation");
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
    fetchSubmittedEvaluations();
  }, []);

  const loggedExaminer = examiners.find(
    (examiner) => examiner.name === examinerUsername
  );
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

  const handleSubmitEvaluation = useCallback(
    async (groupId) => {
      const evaluation = evaluations[groupId];
      if (!evaluation || evaluation.marks === undefined || evaluation.marks === "") {
        alert("Please enter valid marks before submitting.");
        return;
      }

      if (!window.confirm("Are you sure you want to submit this evaluation?"))
        return;

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

        setSubmittedEvaluations((prev) => [
          ...prev,
          { groupId, ...evaluation },
        ]);
        setEvaluations((prev) => ({
          ...prev,
          [groupId]: { ...prev[groupId], submitted: true },
        }));
      } catch (error) {
        alert("Error saving evaluation. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
    [evaluations, loggedExaminer]
  );

  const handleUpdateEvaluation = async () => {
    if (!currentEvaluation || currentEvaluation.marks === undefined || currentEvaluation.marks === "") {
      alert("Please enter valid marks before updating.");
      return;
    }

    try {
      await axios.put(`/api/evaluation/${currentEvaluation._id}`, {
        marks: currentEvaluation.marks,
        remarks: currentEvaluation.remarks || "",
      });

      setSubmittedEvaluations((prev) =>
        prev.map((evalItem) =>
          evalItem._id === currentEvaluation._id
            ? { ...evalItem, marks: currentEvaluation.marks, remarks: currentEvaluation.remarks }
            : evalItem
        )
      );

      setEvaluations((prev) => ({
        ...prev,
        [currentEvaluation.groupID]: { ...prev[currentEvaluation.groupID], submitted: false },
      }));

      setIsModalOpen(false);
      alert("Evaluation updated successfully.");
    } catch (error) {
      alert("Error updating evaluation. Please try again.");
    }
  };

  const handleDeleteEvaluation = async (groupId) => {
    if (!window.confirm("Are you sure you want to delete this evaluation?"))
      return;

    try {
      await axios.delete(`/api/evaluation/${groupId}`);

      setEvaluations((prev) => {
        const updatedEvaluations = { ...prev };
        delete updatedEvaluations[groupId];
        return updatedEvaluations;
      });

      setSubmittedEvaluations((prev) =>
        prev.filter((evalItem) => evalItem.groupID !== groupId)
      );

      alert("Evaluation deleted successfully.");
    } catch (error) {
      alert("Error deleting evaluation. Please try again.");
    }
  };

  const openModal = (evaluation) => {
    setCurrentEvaluation({
      ...evaluation,
      _id: evaluation._id, // Ensure the _id is passed correctly
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentEvaluation(null);
  };

  const handleModalInputChange = (field, value) => {
    setCurrentEvaluation((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <h2 className="text-4xl font-bold text-center mb-8 text-gray-900">
        Examiner Evaluation
      </h2>
      <p className="text-center text-lg mb-6 text-gray-700">
        Logged in as:{" "}
        <span className="font-semibold text-indigo-600">{examinerUsername}</span>
      </p>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              Assigned Groups
            </h3>
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-[#000B58] to-indigo-800 text-white">
                  <th className="py-4 px-6 text-left rounded-tl-2xl">Group ID</th>
                  <th className="py-4 px-6 text-left">Module</th>
                  <th className="py-4 px-6 text-left">Marks</th>
                  <th className="py-4 px-6 text-left">Remarks</th>
                  <th className="py-4 px-6 text-left rounded-tr-2xl">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredGroups.map((group) => {
                  const evaluation = evaluations[group.groupId] || {};
                  return (
                    <tr key={group.groupId} className="border-b hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6">{group.groupId}</td>
                      <td className="py-4 px-6">{group.moduleName}</td>
                      <td className="py-4 px-6">
                        <input
                          type="number"
                          value={evaluation.marks || ""}
                          onChange={(e) =>
                            handleInputChange(group.groupId, "marks", e.target.value)
                          }
                          className="w-20 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          min="0"
                          max="100"
                          disabled={evaluation.submitted}
                        />
                      </td>
                      <td className="py-4 px-6">
                        <input
                          type="text"
                          value={evaluation.remarks || ""}
                          onChange={(e) =>
                            handleInputChange(group.groupId, "remarks", e.target.value)
                          }
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          disabled={evaluation.submitted}
                        />
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleSubmitEvaluation(group.groupId)}
                          className={`px-4 py-2 rounded-lg text-white transition ${
                            evaluation.submitted
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800"
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

          <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              Submitted Evaluations
            </h3>
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-[#000B58] to-indigo-800 text-white">
                  <th className="py-4 px-6 text-left rounded-tl-2xl">Group ID</th>
                  <th className="py-4 px-6 text-left">Marks</th>
                  <th className="py-4 px-6 text-left">Remarks</th>
                  <th className="py-4 px-6 text-left rounded-tr-2xl">Actions</th>
                </tr>
              </thead>
              <tbody>
                {submittedEvaluations.map((evalItem, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">{evalItem.groupID}</td>
                    <td className="py-4 px-6">{evalItem.marks}</td>
                    <td className="py-4 px-6">{evalItem.remarks}</td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => openModal(evalItem)}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white mr-2"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDeleteEvaluation(evalItem.groupID)}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal for Update */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
              <div className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl w-96 shadow-2xl">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                  Update Evaluation
                </h3>
                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-2">Marks</label>
                  <input
                    type="number"
                    value={currentEvaluation.marks || ""}
                    onChange={(e) =>
                      handleModalInputChange("marks", e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    min="0"
                    max="100"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm text-gray-600 mb-2">Remarks</label>
                  <input
                    type="text"
                    value={currentEvaluation.remarks || ""}
                    onChange={(e) =>
                      handleModalInputChange("remarks", e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateEvaluation}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExaminerEvaluation;