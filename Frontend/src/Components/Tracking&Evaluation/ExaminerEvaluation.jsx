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
      await axios.put("/api/evaluation", {
        groupID: currentEvaluation.groupID,
        marks: currentEvaluation.marks,
        remarks: currentEvaluation.remarks || "",
      });

      setSubmittedEvaluations((prev) =>
        prev.map((evalItem) =>
          evalItem.groupID === currentEvaluation.groupID
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
    setCurrentEvaluation(evaluation);
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
    <div className="container mx-auto p-8">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Examiner Evaluation
      </h2>
      <p className="text-center text-lg mb-4">
        Logged in as:{" "}
        <span className="font-semibold text-indigo-600">{examinerUsername}</span>
      </p>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Assigned Groups
            </h3>
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
                          onChange={(e) =>
                            handleInputChange(group.groupId, "marks", e.target.value)
                          }
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
                          onChange={(e) =>
                            handleInputChange(group.groupId, "remarks", e.target.value)
                          }
                          className="px-4 py-2 border rounded-md"
                          disabled={evaluation.submitted}
                        />
                      </td>
                      <td className="py-3 px-6 border">
                        <button
                          onClick={() => handleSubmitEvaluation(group.groupId)}
                          className={`px-4 py-2 rounded-md text-white transition ${
                            evaluation.submitted
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-indigo-600 hover:bg-indigo-700"
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
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Submitted Evaluations
            </h3>
            <table className="w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-indigo-100 text-gray-700">
                  <th className="py-3 px-6 border">Group ID</th>
                  <th className="py-3 px-6 border">Marks</th>
                  <th className="py-3 px-6 border">Remarks</th>
                  <th className="py-3 px-6 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {submittedEvaluations.map((evalItem, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-6 border">{evalItem.groupID}</td>
                    <td className="py-3 px-6 border">{evalItem.marks}</td>
                    <td className="py-3 px-6 border">{evalItem.remarks}</td>
                    <td className="py-3 px-6 border">
                      <button
                        onClick={() => openModal(evalItem)}
                        className="ml-2 px-4 py-2 rounded-md bg-yellow-600 text-white hover:bg-yellow-700"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDeleteEvaluation(evalItem.groupID)}
                        className="ml-2 px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg w-96">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                  Update Evaluation
                </h3>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Marks</label>
                  <input
                    type="number"
                    value={currentEvaluation.marks || ""}
                    onChange={(e) =>
                      handleModalInputChange("marks", e.target.value)
                    }
                    className="px-4 py-2 border rounded-md w-full"
                    min="0"
                    max="100"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm text-gray-600 mb-2">Remarks</label>
                  <input
                    type="text"
                    value={currentEvaluation.remarks || ""}
                    onChange={(e) =>
                      handleModalInputChange("remarks", e.target.value)
                    }
                    className="px-4 py-2 border rounded-md w-full"
                  />
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateEvaluation}
                    className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
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
