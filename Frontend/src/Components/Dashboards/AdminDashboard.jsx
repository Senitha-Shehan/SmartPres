import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
      <h1 className="text-5xl font-bold text-gray-900 mb-12">Admin Dashboard</h1>
      
      <div className="flex flex-col gap-8 w-full max-w-lg">
        {/* Modules Card */}
        <div className="bg-white shadow-lg rounded-lg p-8 h-64 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-gray-800">Modules</h2>
            <p className="text-gray-600 mt-3 text-lg">Manage and configure academic modules.</p>
          </div>
          <div className="mt-4">
            <Link to="/AddModules">
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg hover:bg-blue-700 transition duration-300">
                Manage Modules
              </button>
            </Link>
          </div>
        </div>

        {/* Examiner Card */}
        <div className="bg-white shadow-lg rounded-lg p-8 h-64 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-gray-800">Examiner</h2>
            <p className="text-gray-600 mt-3 text-lg">Oversee and schedule examiner tasks.</p>
          </div>
          <div className="mt-4">
            <Link to="/examineradmin">
              <button className="w-full bg-green-600 text-white py-3 rounded-lg text-lg hover:bg-green-700 transition duration-300">
                Manage Examiner
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
