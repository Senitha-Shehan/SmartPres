import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="navbar bg-base-100 shadow-md px-4">
      {/* Sidebar Toggle */}
      <div className="navbar-start">
        <button
          onClick={() => setIsOpen(!isOpen)}
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
        <a className="text-2xl font-bold">STD MANAGEMENT</a>
      </div>

      {/* Navbar End - Icons & Theme Switcher */}
      <div className="navbar-end flex items-center gap-3">
        {/* Search Icon */}
        <button className="btn btn-ghost btn-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>

        {/* Notification Icon */}
        <button className="btn btn-ghost btn-circle">
          <div className="indicator">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="badge badge-xs badge-primary indicator-item"></span>
          </div>
        </button>

        {/* Theme Switcher */}
        <select
          className="select select-bordered w-24"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      {/* Sidebar Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-base-200 p-5 shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-64"
        } transition-transform duration-300`}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="btn btn-ghost btn-circle absolute top-4 right-4"
        >
          ✕
        </button>

        {/* Sidebar Links */}
        <ul className="menu mt-10 space-y-3">
          <li>
            <Link to="/Home" onClick={() => setIsOpen(false)}>🏠 Homepage</Link>
          </li>
          <li>
            <Link to="/AddUser" onClick={() => setIsOpen(false)}>📋 Student Registration</Link>
          </li>
          <li>
            <Link to="/UserDetails" onClick={() => setIsOpen(false)}>📄 Student List</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
