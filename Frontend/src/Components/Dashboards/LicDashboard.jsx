import React from "react";
import { Link } from "react-router-dom";

const LicDashboard = () => {
  return (
    <div className="p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">LIC Dashboard</h1>
      <div className="flex flex-col gap-6 w-full max-w-6xl items-center">
        {/* Modules Card */}
        <div className="card bg-base-100 shadow-xl w-full max-w-md h-64 flex flex-col justify-between">
          <div className="card-body">
            <h2 className="card-title">Schedule Presentaion</h2>
            <p>Schedule Presentaion</p>
          </div>
          <div className="card-actions justify-end p-4">
            <Link to="/PresentationSchedule">
              <button className="btn btn-primary btn-soft">
                Schedule Presentaion
              </button>
            </Link>
          </div>
        </div>

        {/* Examiner Card */}
        <div className="card bg-base-100 shadow-xl w-full max-w-md h-64 flex flex-col justify-between">
          <div className="card-body">
            <h2 className="card-title">Report</h2>
            <p>Report</p>
          </div>
          <div className="card-actions justify-end p-4">
          <Link to="/PresentationScheduleReport">
            <button className="btn btn-secondary btn-soft">
              Report
            </button>
          </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LicDashboard;
