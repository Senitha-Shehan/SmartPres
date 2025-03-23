import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const ExaminerDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { username } = location.state || {}; // Retrieve username

  return (
    <div className="p-4 flex flex-col items-center">
      <h1 className="text-5xl font-bold text-gray-900 mb-12">Examiner Dashboard</h1>

      <div className="flex flex-col gap-8 w-full max-w-lg">
        {/* Schedule Presentation Card */}
        <div className="bg-white shadow-lg rounded-lg p-8 h-64 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-gray-800">Schedule Presentation</h2>
            <p className="text-gray-600 mt-3 text-lg">Schedule and manage student presentations.</p>
          </div>
          <div className="mt-4">
            <button
              onClick={() => navigate("/ExaminerPresentation", { state: { username } })}
              className="w-full btn btn-soft btn-primary py-3 rounded-lg text-lg transition duration-300"
            >
              Schedule Presentation
            </button>
          </div>
        </div>

        {/* Examiner Evaluation Card */}
        <div className="bg-white shadow-lg rounded-lg p-8 h-64 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-gray-800">Examiner Evaluation</h2>
            <p className="text-gray-600 mt-3 text-lg">Evaluate student performance and provide feedback.</p>
          </div>
          <div className="mt-4">
            <Link to="/ExaminerEvaluation" state={{ username }}>
              <button className="w-full btn btn-soft btn-success py-3 rounded-lg text-lg transition duration-300">
                Examiner Evaluation
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExaminerDashboard;