import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const StroopTest = () => {
  const words = ["Red", "Blue", "Green", "Yellow"];
  const colors = ["red", "blue", "green", "yellow"];
  const totalQuestions = 5;

  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [word, setWord] = useState("");
  const [color, setColor] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [gameData, setGameData] = useState([]); // Store all questions and answers

  const navigate = useNavigate();

  useEffect(() => {
    if (currentQuestion < totalQuestions) {
      generateStroopWord();
    } else {
      setShowResult(true);
      saveResultToLocalStorage();
    }
  }, [currentQuestion]);

  // Generate a random word and color for the Stroop Test
  const generateStroopWord = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setWord(randomWord);
    setColor(randomColor);

    // Store the question and correct answer in memory
    setGameData((prevData) => [
      ...prevData,
      { word: randomWord, color: randomColor },
    ]);
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
      {/* Frame for the game */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-8">
        <h1 className="text-4xl font-extrabold text-gray-800 text-center drop-shadow-md">
          Color Challenge
        </h1>
        <p className="text-lg text-gray-600 mt-2 text-center font-medium">
          Identify the color of the word
        </p>

        {!showResult ? (
          <>
            {/* Display the Stroop word */}
            <div
              className="mt-8 text-7xl font-extrabold p-6 border-4 border-gray-200 bg-gray-50 shadow-lg rounded-xl transition-transform duration-300 transform hover:scale-105 mx-auto text-center"
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
          <div className="mt-12 text-center text-3xl font-bold text-gray-800">
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

            {/* Next Game button */}
            <button
              className="mt-6 px-8 py-3 bg-green-500 text-white text-xl rounded-xl shadow-lg transition-all duration-300 hover:bg-green-600 hover:scale-105 active:scale-95"
              onClick={handleNextButtonClick}
            >
              Next Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StroopTest;