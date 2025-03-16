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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-700">Color Game for Toddlers</h1>
      <p className="text-lg text-gray-600 mt-2">What color is the word?</p>
      {!showResult ? (
        <>
          <div className="mt-6 text-6xl font-bold p-6 border-4 border-black rounded-lg" style={{ color }}>
            {word}
          </div>
          <div className="mt-6 flex space-x-4">
            {colors.map((col) => (
              <button
                key={col}
                className={`px-6 py-3 text-xl font-bold text-white rounded-lg shadow-md`} 
                style={{ backgroundColor: col }}
                onClick={() => checkAnswer(col)}
              >
                {col}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="mt-8 text-center text-2xl font-bold text-gray-700">
          {score / totalQuestions >= 0.5 ? (
            <>
              <span className="text-4xl">😊</span>
              <div>Very Good!</div>
            </>
          ) : (
            <>
              <span className="text-4xl">😢</span>
              <div>Let's try again!</div>
            </>
          )}
          <div className="mt-2">Score: {(score / totalQuestions) * 100}%</div>
          {/* <button
            className="mt-4 px-6 py-2 bg-blue-500 text-white text-lg rounded-lg hover:bg-blue-600"
            onClick={() => {
              setScore(0);
              setCurrentQuestion(0);
              setShowResult(false);
            }}
          >
            </button> */}
            {/* Play Again */}
          
          {/* Next button to show DigitSpanTest */}
          <button
            className="mt-4 px-6 py-2 bg-green-500 text-white text-lg rounded-lg hover:bg-green-600"
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
