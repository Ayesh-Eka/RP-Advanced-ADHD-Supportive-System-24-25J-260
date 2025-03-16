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
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="text-xl font-bold">
          NeuroAssist
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="hover:text-blue-500">
                Home
              </Link>
            </li>
            {!isLoggedIn ? (
              <>
                <li>
                  <Link to="/login" className="hover:text-blue-500">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-blue-500">
                    Sign Up
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/profile" className="hover:text-blue-500">
                    Profile
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="hover:text-blue-500">
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