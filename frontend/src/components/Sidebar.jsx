import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <div className="flex items-center justify-between bg-blue-800 text-white p-4 shadow-md">
        <button onClick={toggleSidebar} className="text-2xl font-bold">
          ☰
        </button>
        <h1 className="text-xl font-semibold">Interview Kit</h1>
      </div>
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 z-50 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300`}
      >
        <div className="p-6 flex flex-col gap-4">
          <h2 className="text-2xl font-bold mb-6">Menu</h2>
          <Link to="/" className="hover:bg-gray-700 px-3 py-2 rounded">
            Dashboard
          </Link>
          <Link to="/courses" className="hover:bg-gray-700 px-3 py-2 rounded">
            Courses
          </Link>
          <Link to="/assessments" className="hover:bg-gray-700 px-3 py-2 rounded">
            Assessments
          </Link>
          <Link
            to="/login"
            className="mt-auto bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-center"
          >
            Login
          </Link>
        </div>
      </div>
    </>
  );
};

export default Sidebar;