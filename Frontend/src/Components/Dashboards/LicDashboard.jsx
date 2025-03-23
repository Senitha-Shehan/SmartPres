import React from "react";
import { Link } from "react-router-dom";

const LicDashboard = () => {
  return (
    <div className="p-4 flex flex-col items-center">
      <h1 className="text-5xl font-bold text-gray-900 mb-12">LIC Dashboard</h1>
      
      <div className="flex flex-col gap-8 w-full max-w-lg">
        {/* Schedule Presentation Card */}
        <div className="bg-white shadow-lg rounded-lg p-8 h-64 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-gray-800">Schedule Presentation</h2>
            <p className="text-gray-600 mt-3 text-lg">Schedule and manage presentations.</p>
          </div>
          <div className="mt-4">
            <Link to="/PresentationSchedule">
              <button className="w-full btn btn-soft btn-primary py-3 rounded-lg text-lg transition duration-300">
                Schedule Presentation
              </button>
            </Link>
          </div>
        </div>

        {/* Report Card */}
        <div className="bg-white shadow-lg rounded-lg p-8 h-64 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-gray-800">Report</h2>
            <p className="text-gray-600 mt-3 text-lg">View and manage reports.</p>
          </div>
          <div className="mt-4">
            <Link to="/PresentationScheduleReport">
              <button className="w-full btn btn-soft btn-success py-3 rounded-lg text-lg transition duration-300">
                View Report
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LicDashboard;