import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { username } = location.state || {};

  return (
    <div className="p-6 flex flex-col items-center ">
      <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>
      <div className="flex flex-col gap-6 w-full max-w-6xl items-center">
        {/* Upcoming Presentation Card */}
        <div className="card bg-base-100 shadow-xl w-full max-w-md h-64 flex flex-col justify-between">
          <div className="card-body">
            <h2 className="card-title">Upcoming Presentation</h2>
            <p>Details about your upcoming presentation</p>
          </div>
          <div className="card-actions justify-end p-4">
            <button
              onClick={() =>
                navigate("/StudentPresentations", { state: { username } })
              }
              className="btn btn-primary w-full btn-soft"
            >
              Upcoming Presentation
            </button>
          </div>
        </div>

        {/* Group Registration Card */}
        <div className="card bg-base-100 shadow-xl w-full max-w-md h-64 flex flex-col justify-between">
          <div className="card-body">
            <h2 className="card-title">Group Registration</h2>
            <p>Register your group for upcoming presentations</p>
          </div>
          <div className="card-actions justify-end p-4">
            <button
              onClick={() =>
                navigate("/GroupRegistration", { state: { username } })
              }
              className="btn btn-secondary w-full btn-soft"
            >
              Group Registration
            </button>
          </div>
        </div>

        {/* Evaluation Results Card */}
        <div className="card bg-base-100 shadow-xl w-full max-w-md h-64 flex flex-col justify-between">
          <div className="card-body">
            <h2 className="card-title">Evaluation Results</h2>
            <p>View your evaluation results</p>
          </div>
          <div className="card-actions justify-end p-4">
            <button className="btn btn-primary w-full btn-soft">
              Evaluation Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
