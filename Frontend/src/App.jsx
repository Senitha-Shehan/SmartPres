import React from "react";
import NavBar from "./Other/NavBar";
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import Login from "./Components/Login/Login";
import ExaminerAdmin from "./Components/ExaminerManagement/ExaminersAdmin";

const App = () => {
  return (
    <div>
      <NavBar />
      <main>
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route path="/ExaminerAdmin" element={<ExaminerAdmin/>} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
