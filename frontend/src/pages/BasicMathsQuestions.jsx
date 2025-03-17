import React, { useState, useEffect } from "react";
import Swal from "sweetalert2"; // Import SweetAlert2
import { useNavigate } from "react-router-dom"; // Import useNavigate

const generateNumber = () => Math.floor(Math.random() * 10) + 1; // Numbers between 1-10
const operations = ["+", "-", "*", "/"];

const generateProblem = () => {
  const num1 = generateNumber();
  const num2 = generateNumber();
  const operation = operations[Math.floor(Math.random() * 4)];
  let answer;

  switch (operation) {
    case "+":
      answer = num1 + num2;
      break;
    case "-":
      answer = num1 - num2;
      break;
    case "*":
      answer = num1 * num2;
      break;
    case "/":
      answer = parseFloat((num1 / num2).toFixed(1));
      break;
    default:
      answer = 0;
  }

  return { num1, num2, operation, answer };
};

const MathGame = () => {
  const [problems, setProblems] = useState(Array.from({ length: 10 }, generateProblem));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [endTime, setEndTime] = useState(null);
  const [showGame, setShowGame] = useState(false); // State to control game visibility

  useEffect(() => {
    // Show SweetAlert2 alert when the component mounts
    Swal.fire({
      title: "Hey Buddy!",
      text: "You have to complete a math game. Click OK to start.",
      icon: "info",
      confirmButtonText: "OK",
      confirmButtonColor: "#4CAF50",
    }).then(() => {
      setShowGame(true); // Show the game after the user clicks OK
      setStartTime(Date.now()); // Start timer when component mounts
    });
  }, []);

  const navigate = useNavigate();

  const handleSubmit = () => {
    const currentProblem = problems[currentIndex];

    if (parseFloat(answer) === currentProblem.answer) {
      setScore(score + 10); // 10 points per correct answer
    }

    if (currentIndex < 9) {
      setCurrentIndex(currentIndex + 1);
      setAnswer("");
    } else {
      setEndTime(Date.now()); // Stop timer after the last question
    }
  };

  const getElapsedTime = () => {
    if (!endTime) return 0;
    return Math.round((endTime - startTime) / 60000); // Convert ms to minutes (rounded)
  };

  const calculateInterestLevel = () => {
    const finalScore = score / 100; // Already scaled to 100
    const timeSpent = Math.min(getElapsedTime(), 60) / 60; // Cap time at 60 min
    const interestLevel = ((finalScore + timeSpent) / 2) * 10;
    const level = Math.round(interestLevel);
    localStorage.setItem("edu", level);
    return level;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {showGame && ( // Only show the game if `showGame` is true
        <div className="bg-gradient-to-r from-yellow-200 to-yellow-300 max-w-md w-full p-6 rounded-xl shadow-lg">
          {endTime ? (
            <div className="text-center">
              <h1 className="text-3xl font-bold text-red-600 mb-4">Finish!</h1>
              <h2 className="text-2xl text-gray-800 mb-2">Score: {score} / 100</h2>
              <h3 className="text-xl text-gray-700 mb-4">Time Spent: {getElapsedTime()} minutes</h3>
              <h2 className="text-2xl text-gray-800 mb-6">Interest Level: {calculateInterestLevel()}</h2>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Play Again
                </button>
                <button
                    onClick={() => {
                        navigate("/NonEducationalActivity"); // Navigate to /tashform
                      }}
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-3xl font-bold text-red-600 mb-4">Math Game for ADHD Children</h1>
              <h2 className="text-2xl text-gray-800 mb-2">
                Question {currentIndex + 1} / 10
              </h2>
              <h2 className="text-2xl text-gray-800 mb-4">Score: {score} / 100</h2>
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  {problems[currentIndex].num1} {problems[currentIndex].operation}{" "}
                  {problems[currentIndex].num2} = ?
                </h2>
                <input
                  type="number"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Enter Answer"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-xl"
                />
              </div>
              <button
                onClick={handleSubmit}
                className="w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors text-xl"
              >
                Submit
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MathGame;