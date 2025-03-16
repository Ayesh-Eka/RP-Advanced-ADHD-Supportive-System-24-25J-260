import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import TextChatbot from './components/TextChatbot'; // Import TextChatbot
import PredictionForm from './components/PredictionForm';
import StroopTest from './pages/stroop';
import DigitSpanTest from './pages/digitspan';
import FollowInstructionsGame from './pages/followinginstruction';


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
            <Route path="/text-chatbot" element={<TextChatbot />} /> 
            <Route path="/predict" element={<PredictionForm />} /> {/* Add TextChatbot route */}
            <Route path="/stroop" element={<StroopTest />} />
            <Route path="/digit-span" element={<DigitSpanTest />} />
            <Route path="/follow-instructions" element={<FollowInstructionsGame />} />

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;