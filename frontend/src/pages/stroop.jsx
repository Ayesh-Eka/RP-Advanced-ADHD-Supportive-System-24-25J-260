import React, { useState, useEffect } from "react";
import DigitSpanTest from "./digitspan"; // Import the DigitSpanTest component

const StroopTest = () => {
  const words = ["Red", "Blue", "Green", "Yellow"];
  const colors = ["red", "blue", "green", "yellow"];
  const totalQuestions = 5;

  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [word, setWord] = useState("");
  const [color, setColor] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [showNextGame, setShowNextGame] = useState(false); // State for showing the next game

  useEffect(() => {
    if (currentQuestion < totalQuestions) {
      generateStroopWord();
    } else {
      setShowResult(true);
    }
  }, [currentQuestion]);

  const generateStroopWord = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setWord(randomWord);
    setColor(randomColor);
  };

  const checkAnswer = (selectedColor) => {
    if (selectedColor === color) {
      setScore(score + 1);
    }
    setCurrentQuestion(currentQuestion + 1);
  };

  const handleNextButtonClick = () => {
    setShowNextGame(true); // Show next game after this one
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 p-6">
      <h1 className="text-4xl font-extrabold text-white drop-shadow-md">Color Challenge</h1>
      <p className="text-lg text-white mt-2 font-medium drop-shadow">Identify the color of the word</p>

      {!showResult ? (
        <>
          <div className="mt-8 text-7xl font-extrabold p-6 border-4 border-white bg-white shadow-lg rounded-xl transition-transform duration-300 transform hover:scale-105" style={{ color }}>
            {word}
          </div>
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

          <button
            className="mt-4 px-8 py-3 bg-green-500 text-white text-xl rounded-xl shadow-lg transition-all duration-300 hover:bg-green-600 hover:scale-105 active:scale-95"
            onClick={handleNextButtonClick}
          >
            Next Game
          </button>
        </div>
      )}

      {/* Show the next game (DigitSpanTest) */}
      {showNextGame && <DigitSpanTest />}
    </div>
  );
};

export default StroopTest;
