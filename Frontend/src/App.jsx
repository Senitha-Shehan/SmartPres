import React from "react";
import NavBar from "./Other/NavBar";
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import Login from "./Components/Login/Login";

const App = () => {
  return (
    <div>
      <NavBar />
      <main>
        <Routes>
          <Route path="/Login" element={<Login />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
