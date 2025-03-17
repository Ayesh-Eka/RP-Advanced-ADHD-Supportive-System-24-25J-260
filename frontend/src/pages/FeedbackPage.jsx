import React from 'react';
import { useLocation } from 'react-router-dom';

const FeedbackPage = () => {
  const location = useLocation();
  const { userResponses } = location.state || { userResponses: [] };

  // Calculate the score
  const score = userResponses.filter((response) => response.isPositive).length;

  // Provide advice based on the score
  const advice =
    score >= 4
      ? "Excellent! You have great social skills. Keep up the good work!"
      : score >= 2
      ? "Good job! You have decent social skills, but there's room for improvement. Keep practicing!"
      : "You might want to work on your social skills. Don't worry, practice makes perfect!";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all ">
        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-purple-800 mb-6">
          Feedback Report
        </h1>

        {/* Score Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">Your Score</h2>
          <p className="text-5xl sm:text-6xl font-bold">{score} / 5</p>
        </div>

        {/* Advice Section */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-purple-800 mb-4">Advice</h2>
          <p className="text-gray-700 text-base sm:text-lg">{advice}</p>
        </div>

        {/* Responses Section */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl sm:text-2xl font-semibold text-purple-800 mb-4">
            Your Responses
          </h2>
          <ul className="space-y-4">
            {userResponses.map((response, index) => (
              <li
                key={index}
                className={`p-4 rounded-lg ${
                  response.isPositive ? 'bg-green-50' : 'bg-red-50'
                }`}
              >
                <p className="text-base sm:text-lg font-semibold text-gray-800">
                  <span className="text-purple-600">Question {index + 1}:</span> {response.question}
                </p>
                <p className="text-gray-700 text-sm sm:text-base">
                  <span className="font-medium">Your Response:</span> {response.response}
                </p>
                <p
                  className={`text-sm font-semibold ${
                    response.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {response.isPositive ? 'Correct' : 'Incorrect'}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Call to Action */}
        <div className="mt-8 text-center">
          <button
            onClick={() => window.location.href = '/'} // Home
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all text-sm sm:text-base"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;