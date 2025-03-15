import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const predefinedUsers = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "lic", password: "lic123", role: "lic" },
  { username: "examiner", password: "examiner123", role: "examiner" },
  { username: "student", password: "student123", role: "student" },
];

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [theme, setTheme] = useState("light");
  const [toastMessage, setToastMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(""); // Hide toast after 3 seconds
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = predefinedUsers.find(
      (user) => user.username === username && user.password === password
    );
    if (user) {
      setToastMessage(`Welcome ${user.username}!`);
      setTimeout(() => {
        switch (user.role) {
          case "admin":
            navigate("/Admin-Dashboard");
            break;
          case "lic":
            navigate("/Lic-Dashboard");
            break;
          case "examiner":
            navigate("/Examiner-Dashboard");
            break;
          case "student":
            navigate("/student-dashboard");
            break;
          default:
            navigate("/");
        }
      }, 1000); // Delay to show toast before redirecting
    } else {
      setError("Invalid credentials");
      setToastMessage("Login failed. Invalid credentials.");
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-gray-30"
      style={{ backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="username" className="text-gray-600 text-sm mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your username"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="text-gray-600 text-sm mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>
        </form>
      </div>

      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white p-3 rounded-lg shadow-lg z-50 transition-all duration-300">
          <p>{toastMessage}</p>
        </div>
      )}
    </div>
  );
};

export default Login;
