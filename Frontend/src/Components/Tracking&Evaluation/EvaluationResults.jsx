import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "../../lib/axios";

const EvaluationResults = () => {
  const location = useLocation();
  const { username } = location.state || {}; // Assuming username is the student's IT number

  const [evaluationResults, setEvaluationResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Step 1: Fetch groups where the logged-in user is the leader
        const groupsResponse = await axios.get(`/api/groups/student/${username}`);
        const userGroups = groupsResponse.data;

        // Extract group IDs where the user is the leader
        const groupIDs = userGroups
          .filter((group) => group.leaderId === username)
          .map((group) => group.groupId);

        if (groupIDs.length === 0) {
          setEvaluationResults([]); // No groups found for the user
          return;
        }

        // Step 2: Fetch evaluations for the filtered group IDs
        const evaluationsResponse = await axios.get(`/api/evaluation`);
        const filteredEvaluations = evaluationsResponse.data.filter((evalItem) =>
          groupIDs.includes(evalItem.groupID)
        );

        // Step 3: Match moduleName to the first two letters of groupID
        const matchedEvaluations = filteredEvaluations.map((evalItem) => {
          const group = userGroups.find((group) => group.groupId === evalItem.groupID);
          if (group) {
            // Extract the first two letters of the groupID
            const groupIDPrefix = evalItem.groupID.substring(0, 2).toUpperCase();
            // Match the prefix to the moduleName
            const moduleName = group.moduleName.startsWith(groupIDPrefix)
              ? group.moduleName
              : `Unknown Module (${groupIDPrefix})`;
            return { ...evalItem, moduleName };
          }
          return evalItem; // If no matching group is found, return the original evaluation
        });

        setEvaluationResults(matchedEvaluations);
      } catch (err) {
        setError("Failed to fetch evaluation results. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchData();
    }
  }, [username]);

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
        Welcome, {username}!
      </h1>
      <h2 className="text-2xl font-bold mb-4">Evaluation Results</h2>
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : evaluationResults.length > 0 ? (
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-indigo-100 text-gray-700">
              <th className="py-3 px-6 border">Group ID</th>
              <th className="py-3 px-6 border">Module</th>
              <th className="py-3 px-6 border">Marks</th>
              <th className="py-3 px-6 border">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {evaluationResults.map((result) => (
              <tr key={result.groupID} className="border-b hover:bg-gray-50">
                <td className="py-3 px-6 border">{result.groupID}</td>
                <td className="py-3 px-6 border">{result.moduleName}</td>
                <td className="py-3 px-6 border">{result.marks}</td>
                <td className="py-3 px-6 border">{result.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-600">No evaluation results found.</p>
      )}
    </div>
  );
};

export default EvaluationResults;