import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('http://localhost:5000/api/auth/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setProfile(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch profile', error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to the Home Page</h1>
        {profile ? (
          <div>
            <p className="text-gray-700">Hello, {profile.user.username}!</p>
            <p className="text-gray-700">You are logged in.</p>
          </div>
        ) : (
          <p className="text-gray-700">Please log in to access more features.</p>
        )}
      </div>
    </div>
  );
};

export default Home;