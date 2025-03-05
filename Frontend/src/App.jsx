import React from "react";
import NavBar from "./Other/NavBar";
import Footer from "./Other/Footer";
import { Routes, Route } from "react-router-dom";
import Login from "./Components/Login/Login";

import ExaminerAdmin from "./Components/ExaminerManagement/ExaminersAdmin";

import AdminDashboard from "./Components/Dashboards/AdminDashboard";
import ExaminerDashboard from "./Components/Dashboards/ExaminerDashboard";
import LicDashboard from "./Components/Dashboards/LicDashboard";
import StudentDashboard from "./Components/Dashboards/StudentDashboard";
import AddModules from "./Components/Modules&GroupManagement/AddModules";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      <main className="flex-grow p-6">
        <Routes>
          <Route path="/Login" element={<Login />} />

          <Route path="/ExaminerAdmin" element={<ExaminerAdmin />} />

          <Route path="/Admin-Dashboard" element={<AdminDashboard />} />
          <Route path="/Examiner-Dashboard" element={<ExaminerDashboard />} />
          <Route path="/Lic-Dashboard" element={<LicDashboard />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/AddModules" element={<AddModules />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;
