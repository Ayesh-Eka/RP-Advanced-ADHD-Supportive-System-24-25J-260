import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
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
        <nav>
          <ul className="flex space-x-6 items-center">
            <li>
              <Link
                to="/"
                className="text-gray-300 hover:text-purple-400 transition duration-300"
              >
                Home
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
                    className="text-gray-300 hover:text-purple-400 transition duration-300"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-gray-300 hover:text-purple-400 transition duration-300"
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