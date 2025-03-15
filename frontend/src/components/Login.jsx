import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      alert('Login successful');
    } catch (error) {
      alert('Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="p-2 border rounded" />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="p-2 border rounded" />
      <button type="submit" className="p-2 bg-blue-500 text-white rounded">Login</button>
    </form>
  );
};

export default Login;