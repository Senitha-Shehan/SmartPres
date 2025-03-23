import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); // Get the current route
  const navigate = useNavigate(); // Hook for navigation

  // Close sidebar when clicking outside or pressing ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Define sidebar menus
  const userMenu = [
    { path: "/Home", icon: "🏠", label: "Homepage" },
    { path: "/AddUser", icon: "📋", label: "Student Registration" },
    { path: "/UserDetails", icon: "📄", label: "Student List" },
  ];

  const examinerMenu = [
    { path: "/Home", icon: "🏠", label: "Upcoming Presentation" },
    { path: "/AddUser", icon: "📋", label: "Evalutaion Presentaion" },
  ];

  const adminMenu = [
    { path: "/AddModules", icon: "📊", label: "Modules" },
    { path: "/admin/manage-users", icon: "👥", label: "Examiner" },
  ];

  const licMenu = [
    { path: "/lic/dashboard", icon: "📚", label: "Schedule Presentaion" },
    { path: "/lic/courses", icon: "📖", label: "Report & ______" },
  ];

  const studentMenu = [
    { path: "/student/courses", icon: "📘", label: "Upcoming Presentaion" },
    { path: "/student/assignments", icon: "📝", label: "Group Registration" },
    { path: "/student/results", icon: "🎓", label: "Evaluation Results" },
  ];

  // Determine which menu to display based on route
  let menuItems;
  if (location.pathname.startsWith("/Admin-Dashboard")) {
    menuItems = adminMenu;
  } else if (location.pathname.startsWith("/Lic-Dashboard")) {
    menuItems = licMenu;
  } else if (location.pathname.startsWith("/student-dashboard")) {
    menuItems = studentMenu;
  } else if (location.pathname.startsWith("/Examiner-Dashboard")) {
    menuItems = examinerMenu;
  } else {
    menuItems = userMenu;
  }

  // Handle logout
  const handleLogout = () => {
    // Perform logout actions (e.g., clear session, remove tokens, etc.)
    localStorage.removeItem("authToken"); // Example: Remove auth token
    navigate("/"); // Redirect to login page
  };

  return (
    <>
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow-md px-4 h-15">
        {/* Sidebar Toggle Button */}
        <div className="navbar-start">
          <button
            onClick={() => setIsOpen(true)}
            className="btn btn-ghost btn-circle"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </button>
        </div>

        {/* Navbar Center - Title */}
        <div className="navbar-center">
          <span className="text-2xl font-bold">SmartPres</span>
        </div>

        {/* Navbar End - Icons */}
        <div className="navbar-end flex items-center gap-3">
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="btn btn-ghost btn-circle"
            title="Logout"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Sidebar with Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 backdrop-brightness-75 bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-base-200 shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-72"
        } transition-transform duration-300 z-50`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-lg font-semibold">Navigation</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="btn btn-ghost btn-circle"
          >
            ✕
          </button>
        </div>

        {/* Sidebar Menu */}
        <ul className="menu p-4 w-full text-base-content">
          {menuItems.map((item) => (
            <li key={item.path} className="mb-2">
              <Link
                to={item.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center p-3 rounded-lg transition-all hover:bg-primary hover:text-white"
              >
                <span className="text-lg">{item.icon}</span>
                <span className="ml-2">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Navbar;