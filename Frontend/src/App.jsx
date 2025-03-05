import React from "react";
import NavBar from "./Other/NavBar";
import Footer from "./Other/Footer";
import { Routes, Route } from "react-router-dom";
import Login from "./Components/Login/Login";
import ExaminerAdmin from "./Components/ExaminerManagement/ExaminersAdmin";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">

      <NavBar />

      <main className="flex-grow p-6">
        <Routes>
          <Route path="/Login" element={<Login />} />

          <Route path="/ExaminerAdmin" element={<ExaminerAdmin/>} />

          

        </Routes>
      </main>


      <Footer />
    </div>
  );
};

export default App;
