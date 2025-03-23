import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { username } = location.state || {};

  return (
    <div className="p-4 flex flex-col items-center">
      <h1 className="text-5xl font-bold text-gray-900 mb-12">Student Dashboard</h1>
      
      <div className="flex flex-col gap-8 w-full max-w-lg">
        {/* Upcoming Presentation Card */}
        <div className="bg-white shadow-lg rounded-lg p-8 h-64 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-gray-800">Upcoming Presentation</h2>
            <p className="text-gray-600 mt-3 text-lg">Details about your upcoming presentation.</p>
          </div>
          <div className="mt-4">
            <button
              onClick={() =>
                navigate("/StudentPresentations", { state: { username } })
              }
              className="w-full btn btn-soft btn-primary py-3 rounded-lg text-lg transition duration-300"
            >
              Upcoming Presentation
            </button>
          </div>
        </div>

        {/* Group Registration Card */}
        <div className="bg-white shadow-lg rounded-lg p-8 h-64 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-gray-800">Group Registration</h2>
            <p className="text-gray-600 mt-3 text-lg">Register your group for upcoming presentations.</p>
          </div>
          <div className="mt-4">
            <button
              onClick={() =>
                navigate("/GroupRegistration", { state: { username } })
              }
              className="w-full btn btn-soft btn-success py-3 rounded-lg text-lg transition duration-300"
            >
              Group Registration
            </button>
          </div>
        </div>

        {/* Evaluation Results Card */}
        <div className="bg-white shadow-lg rounded-lg p-8 h-64 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-gray-800">Evaluation Results</h2>
            <p className="text-gray-600 mt-3 text-lg">View your evaluation results.</p>
          </div>
          <div className="mt-4">
            <button
              onClick={() =>
                navigate("/EvaluationResults", { state: { username } })
              }
              className="w-full btn btn-soft btn-primary py-3 rounded-lg text-lg transition duration-300"
            >
              Evaluation Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;