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
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = predefinedUsers.find(
      (user) => user.username === username && user.password === password
    );
    if (user) {
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
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-base-100">

      <div className="bg-base-200 shadow-lg rounded-lg p-8 w-96">
        <h2 className="text-2xl font-semibold text-center text-primary mb-4">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-base-content">Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full input input-bordered"
            />
          </div>
          <div>
            <label className="block text-base-content">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full input input-bordered"
            />
          </div>
          {error && <p className="text-error text-sm">{error}</p>}
          <button type="submit" className="w-full btn btn-primary">
            Login
          </button>
        </form>
        
      </div>
    </div>
  );
};

export default Login;
