import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import TextChatbot from './components/TextChatbot'; // Import TextChatbot
import BoxClickGame from "./components/BoxClickGame";
import ImproveAttentionTask from "./components/ImproveAttentionTask";
import ControlHyperactivity from "./components/ControlHyperactivity";
import TrainAttentionHyperactivity from "./components/TrainAttentionHyperactivity";

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/text-chatbot" element={<TextChatbot />} /> {/* Add TextChatbot route */}
            <Route path="/go" element={<BoxClickGame />} />
            <Route path="/improve-attention" element={<ImproveAttentionTask />} />
            <Route path="/control-impulsiveness" element={<ControlHyperactivity />} />
           <Route path="/train-attention-hyperactivity" element={<TrainAttentionHyperactivity />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;