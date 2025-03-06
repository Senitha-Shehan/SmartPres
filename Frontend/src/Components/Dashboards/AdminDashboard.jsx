import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="p-6 flex flex-col items-center min-h-screen bg-white-100">
      <h1 className="text-4xl font-bold mb-6 underline">Admin Dashboard</h1>
      <div className="flex flex-col gap-6 w-full max-w-6xl items-center">
        {/* Modules Card */}
        <div className="card bg-base-100 shadow-xl w-full max-w-md h-64 flex flex-col justify-between">
          <div className="card-body">
            <h2 className="card-title">Modules</h2>
            <p>Manage and configure academic modules.</p>
          </div>
          <div className="card-actions justify-end p-4">
            <Link to="/AddModules">
              <button className="btn btn-soft btn-primary">Manage Modules</button>
            </Link>
          </div>
        </div>

        {/* Examiner Card */}
        <div className="card bg-base-100 shadow-xl w-full max-w-md h-64 flex flex-col justify-between">
          <div className="card-body">
            <h2 className="card-title">Examiner</h2>
            <p>Oversee and schedule examiner tasks.</p>
          </div>
          <div className="card-actions justify-end p-4">
            <Link to="/AddModules">
              <button className="btn btn-soft btn-secondary">Manage Examiner</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
