import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token');
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage mobile menu toggle

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gray-800 shadow-lg">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link
          to="/"
          className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 hover:from-pink-600 hover:to-purple-400 transition-all duration-500"
        >
          NeuroAssist
        </Link>

        {/* Burger Menu Icon for Mobile */}
        <button
          onClick={toggleMenu}
          className="lg:hidden text-gray-300 hover:text-purple-400 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>

        {/* Navigation Menu */}
        <nav className={`${isMenuOpen ? 'block' : 'hidden'} lg:flex lg:items-center`}>
          <ul className="flex flex-col lg:flex-row lg:space-x-6 space-y-4 lg:space-y-0 items-center">
            <li>
              <Link
                to="/"
                className="text-gray-300 hover:text-purple-400 transition duration-300"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/predict"
                className="text-gray-300 hover:text-purple-400 transition duration-300"
              >
                ADHD Identification
              </Link>
            </li>
            <li>
              <Link
                to="/go"
                className="text-gray-300 hover:text-purple-400 transition duration-300"
              >
                Cognitive Enhancement
              </Link>
            </li>
            <li>
              <Link
                to="/EducationalActivity"
                className="text-gray-300 hover:text-purple-400 transition duration-300"
              >
                Organize Daily Tasks
              </Link>
            </li>
            <li>
              <Link
                to="/SocialSkills"
                className="text-gray-300 hover:text-purple-400 transition duration-300"
              >
                Improve Social Skills
              </Link>
            </li>
            {!isLoggedIn ? (
              <>
                <li>
                  <Link
                    to="/login"
                    className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-2 rounded-full hover:from-pink-600 hover:to-purple-500 transition-all duration-300 shadow-lg"
                  >
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-6 py-2 rounded-full hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg"
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/profile"
                    className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-6 py-2 rounded-full hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-red-700 to-red-300 text-white px-6 py-2 rounded-full hover:from-red-400 hover:to-red-700 transition-all duration-300 shadow-lg"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;