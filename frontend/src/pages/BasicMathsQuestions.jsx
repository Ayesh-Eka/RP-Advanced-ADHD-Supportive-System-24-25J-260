import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const generateNumber = (min = 1, max = 10) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const generateProblem = (allowedOperations, ageGroup) => {
  let num1, num2, answer;
  const operation =
    allowedOperations[Math.floor(Math.random() * allowedOperations.length)];

  if (ageGroup === "10-12" && (operation === "+" || operation === "-")) {
    num1 = generateNumber(100, 999);
    num2 = generateNumber(100, 999);
  } else {
    num1 = generateNumber(1, 10);
    num2 = generateNumber(1, 10);
  }

  if (operation === "-" && num1 < num2) {
    [num1, num2] = [num2, num1];
  }

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
  const navigate = useNavigate();
  const [ageGroup, setAgeGroup] = useState("");
  const [problems, setProblems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

  const handleStart = () => {
    if (!ageGroup) {
      Swal.fire("Please select an age group to start!");
      return;
    }

    let operations = [];
    if (ageGroup === "6-9") {
      operations = ["+", "-"];
    } else if (ageGroup === "10-12") {
      operations = ["+", "-", "*", "/"];
    }

    const generatedProblems = Array.from({ length: 10 }, () =>
      generateProblem(operations, ageGroup)
    );
    setProblems(generatedProblems);
    setGameStarted(true);
    localStorage.setItem("ageGroup", ageGroup); // Store age group
  };

  const handleSubmit = () => {
    const currentProblem = problems[currentIndex];
    if (parseFloat(answer) === currentProblem.answer) {
      setScore(score + 10);
    }

    if (currentIndex < 9) {
      setCurrentIndex(currentIndex + 1);
      setAnswer("");
    } else {
      setEndTime(Date.now());
    }
  };

  const getElapsedTime = () => {
    if (!endTime) return 0;
    return Math.round((endTime - startTime) / 60000);
  };

  const calculateInterestLevel = () => {
    const finalScore = score / 100;
    const timeSpent = Math.min(getElapsedTime(), 60) / 60;
    const interestLevel = ((finalScore + timeSpent) / 2) * 10;
    const level = Math.round(interestLevel);
    localStorage.setItem("edu", level);
    return level;
  };

  useEffect(() => {
    if (gameStarted) {
      Swal.fire({
        title: "Hello Friend!",
        text: "You have solve basic math questions. Click OK to start",
        icon: "info",
        confirmButtonText: "OK",
        confirmButtonColor: "#6EE7B7",
        background: "linear-gradient(135deg, #A5D6A7 0%, #C5CAE9 100%)",
        iconColor: "#4A90E2",
        color: "#2C3E50",
      }).then(() => {
        setStartTime(Date.now());
      });
    }
  }, [gameStarted]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-purple-200 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        {!gameStarted ? (
          <>
            <h1 className="text-3xl font-bold mb-4 text-center text-purple-700">
              Select Age Group
            </h1>
            <select
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value)}
              className="w-full p-3 mb-6 border-2 border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 text-lg"
            >
              <option value="">Select Age Group</option>
              <option value="6-9">6 - 9 years</option>
              <option value="10-12">10 - 12 years</option>
            </select>
            <button
              onClick={handleStart}
              className="w-full bg-purple-500 text-white py-3 rounded-full hover:bg-purple-600 transition"
            >
              Start
            </button>
          </>
        ) : endTime ? (
          <div className="text-center">
            <h1 className="text-4xl font-bold text-purple-800 mb-4">Finish!</h1>
            <h2 className="text-3xl text-blue-800 mb-2">Score: {score} / 100</h2>
            <h3 className="text-2xl text-green-800 mb-4">Time Spent: {getElapsedTime()} minutes</h3>
            <h2 className="text-3xl text-red-800 mb-6">Interest Level: {calculateInterestLevel()}</h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition"
              >
                Play Again 🔄
              </button>
              <button
                onClick={() => navigate(`/NonEducationalActivity?ageGroup=${ageGroup}`)}
                className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition"
              >
                Next ➡️
              </button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-purple-800 mb-2">Math game for you 🧮</h1>
            <h2 className="text-xl text-blue-800 mb-2">Question {currentIndex + 1} / 10</h2>
            <h2 className="text-xl text-green-800 mb-4">Score: {score} / 100</h2>
            <div className="bg-yellow-100 p-6 rounded-2xl shadow-inner mb-4">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                {problems[currentIndex].num1} {problems[currentIndex].operation}{" "}
                {problems[currentIndex].num2} = ?
              </h2>
              <input
                type="number"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter Answer"
                className="w-full p-3 border-2 border-purple-300 rounded-full text-center text-2xl"
              />
            </div>
            <button
              onClick={handleSubmit}
              className="w-full bg-purple-500 text-white px-6 py-3 rounded-full hover:bg-purple-600 transition text-2xl"
            >
              Submit
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MathGame;
