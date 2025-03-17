import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

const StroopTest = () => {
  const words = ["Red", "Blue", "Green", "Yellow"];
  const colors = ["red", "blue", "green", "yellow"];
  const totalQuestions = 5;

  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [word, setWord] = useState("");
  const [color, setColor] = useState("");
  const [showResult, setShowResult] = useState(false);

  const navigate = useNavigate(); // Hook to navigate to another page

  useEffect(() => {
    if (currentQuestion < totalQuestions) {
      generateStroopWord();
    } else {
      setShowResult(true);
      saveResultToLocalStorage(); // Save result when the test is complete
    }
  }, [currentQuestion]);

  // Generate a random word and color for the Stroop Test
  const generateStroopWord = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setWord(randomWord);
    setColor(randomColor);
  };

  // Check if the selected color matches the displayed color
  const checkAnswer = (selectedColor) => {
    if (selectedColor === color) {
      setScore(score + 1);
    }
    setCurrentQuestion(currentQuestion + 1);
  };

  // Save the result to local storage
  const saveResultToLocalStorage = () => {
    const EasilyDistracted = score / totalQuestions < 0.5 ? 1 : 0; // 1 if score < 50%, else 0
    const storedData = JSON.parse(localStorage.getItem("userInputs")) || {};
    storedData.easily_distracted = EasilyDistracted; // Add the result to the stored data
    localStorage.setItem("userInputs", JSON.stringify(storedData));
    console.log("Stroop Test result saved to local storage:", storedData);
  };

  // Handle "Next Game" button click
  const handleNextButtonClick = () => {
    navigate("/digit-span"); // Navigate to the next game route
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 p-6">
      <h1 className="text-4xl font-extrabold text-white drop-shadow-md">Color Challenge</h1>
      <p className="text-lg text-white mt-2 font-medium drop-shadow">Identify the color of the word</p>

      {!showResult ? (
        <>
          {/* Display the Stroop word */}
          <div
            className="mt-8 text-7xl font-extrabold p-6 border-4 border-white bg-white shadow-lg rounded-xl transition-transform duration-300 transform hover:scale-105"
            style={{ color }}
          >
            {word}
          </div>

          {/* Display color options */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {colors.map((col) => (
              <button
                key={col}
                className="px-8 py-4 text-2xl font-bold text-white rounded-xl shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
                style={{ backgroundColor: col }}
                onClick={() => checkAnswer(col)}
              >
                {col.charAt(0).toUpperCase() + col.slice(1)}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="mt-12 text-center text-3xl font-bold text-white">
          {/* Display result based on score */}
          {score / totalQuestions >= 0.5 ? (
            <>
              <span className="text-6xl">🎉</span>
              <div className="mt-4">Great Job!</div>
            </>
          ) : (
            <>
              <span className="text-6xl">😢</span>
              <div className="mt-4">Try Again!</div>
            </>
          )}
          <div className="mt-2 text-2xl">Score: {(score / totalQuestions) * 100}%</div>

          {/* Play Again button */}
          <button
            className="mt-6 px-8 py-3 bg-blue-600 text-white text-xl rounded-xl shadow-lg transition-all duration-300 hover:bg-blue-700 hover:scale-105 active:scale-95"
            onClick={() => {
              setScore(0);
              setCurrentQuestion(0);
              setShowResult(false);
            }}
          >
            Play Again
          </button>

          {/* Next Game button */}
          <button
            className="mt-4 px-8 py-3 bg-green-500 text-white text-xl rounded-xl shadow-lg transition-all duration-300 hover:bg-green-600 hover:scale-105 active:scale-95"
            onClick={handleNextButtonClick}
          >
            Next Game
          </button>
        </div>
      )}
    </div>
  );
};

export default StroopTest;
