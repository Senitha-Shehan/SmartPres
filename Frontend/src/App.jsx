import React from "react";
import NavBar from "./Other/NavBar";
import Footer from "./Other/Footer";
import { Routes, Route } from "react-router-dom";
import Login from "./Components/Login/Login";
import ExaminerAdmin from "./Components/ExaminerManagement/ExaminersAdmin";
import PresentationSchedule from "./Components/PresentationScheduleManagement/PresentationSchdule";

import AdminDashboard from "./Components/Dashboards/AdminDashboard";
import ExaminerPresentation from "./Components/ExaminerManagement/ExaminerPresentation";
import LicDashboard from "./Components/Dashboards/LicDashboard";
import StudentDashboard from "./Components/Dashboards/StudentDashboard";
import AddModules from "./Components/Modules&GroupManagement/AddModules";
import GroupRegistration from "./Components/Modules&GroupManagement/GroupRegistration";
import StudentPresentations from "./Components/PresentationScheduleManagement/StudentsPresentations";
import PresentationScheduleReport from "./Components/PresentationScheduleManagement/PresentationScheduleReport";


import EvaluationResults from "./Components/Tracking&Evaluation/EvaluationResults";

import BGI3mg from './Pictures/BG03.jpg';

import ExaminerEvaluation from "./Components/Tracking&Evaluation/ExaminerEvaluation";
import ExaminerDashboard from "./Components/Dashboards/ExaminerDashboard";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${BGI3mg})` }}>
      <NavBar />

      <main className="flex-grow p-6">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/ExaminerAdmin" element={<ExaminerAdmin />} />
          <Route path="/PresentationSchedule" element={<PresentationSchedule />} />
          <Route path="/Admin-Dashboard" element={<AdminDashboard />} />
          <Route path="/ExaminerPresentation" element={<ExaminerPresentation />} />
          <Route path="/Lic-Dashboard" element={<LicDashboard />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/AddModules" element={<AddModules />} />
          <Route path="/GroupRegistration" element={<GroupRegistration />} />
          <Route path="/StudentPresentations" element={<StudentPresentations />} />
          <Route path="/PresentationScheduleReport" element={<PresentationScheduleReport />} />
          <Route path="/Examiner-Dashboard" element={<ExaminerDashboard />} />
          <Route path="/ExaminerEvaluation" element={<ExaminerEvaluation />} />
          <Route path="/EvaluationResults" element={<EvaluationResults />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;
