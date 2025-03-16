import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login'); // Redirect to login if no token
          return;
        }

        const response = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data.user);
      } catch (error) {
        console.error('Failed to fetch profile', error);
        navigate('/login'); // Redirect to login if token is invalid
      }
    };

    fetchProfile();
  }, [navigate]);

  if (!profile) {
    return <div>Loading...</div>; // Show a loading state while fetching profile
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <p className="mt-1 p-2 bg-gray-50 rounded">{profile.username}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 p-2 bg-gray-50 rounded">{profile.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;