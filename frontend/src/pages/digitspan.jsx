import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const DigitSpanTest = () => {
  const sequences = [
    [1, 2],
    [3, 4],
    [2, 1],
    [4, 3],
    [1, 3],
  ];

  const [currentSequenceIndex, setCurrentSequenceIndex] = useState(0);
  const [displaySequence, setDisplaySequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [score, setScore] = useState(0);
  const [showNumbers, setShowNumbers] = useState(true);
  const [result, setResult] = useState(null);
  const [showNextGame, setShowNextGame] = useState(false);

  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    showSequence();
  }, [currentSequenceIndex]);

  // Display the current sequence
  const showSequence = () => {
    setDisplaySequence(sequences[currentSequenceIndex]);
    setShowNumbers(true);
    setTimeout(() => {
      setShowNumbers(false);
    }, 2000);
  };

  // Handle user clicking a number
  const handleNumberClick = (number) => {
    const newUserSequence = [...userSequence, number];
    setUserSequence(newUserSequence);

    if (newUserSequence.length === sequences[currentSequenceIndex].length) {
      checkAnswer(newUserSequence);
    }
  };

  // Check if the user's sequence matches the displayed sequence
  const checkAnswer = (newUserSequence) => {
    if (
      JSON.stringify(newUserSequence) ===
      JSON.stringify(sequences[currentSequenceIndex])
    ) {
      setScore(score + 1);
    }
    setUserSequence([]);
    if (currentSequenceIndex < sequences.length - 1) {
      setCurrentSequenceIndex(currentSequenceIndex + 1);
    } else {
      showFinalResult();
    }
  };

  // Show the final result and save it to local storage
  const showFinalResult = () => {
    const percentage = (score / sequences.length) * 100;
    const difficultyFocusing = percentage < 50 ? 1 : 0; // 1 if score < 50%, else 0
    setResult({
      emoji: percentage >= 50 ? "😊" : "😢",
      message: percentage >= 50 ? "Very Good!" : "Let's try again!",
      value: difficultyFocusing,
    });

    // Save the result to local storage
    const storedData = JSON.parse(localStorage.getItem("userInputs")) || {};
    storedData.focus_difficulty = difficultyFocusing; // Add the result to the stored data
    localStorage.setItem("userInputs", JSON.stringify(storedData));
    console.log("DigitSpan Test result saved to local storage:", storedData);
  };

  // Handle "Next Game" button click
  const handleNextButtonClick = () => {
    navigate("/follow-instructions"); // Navigate to the next game route
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Number Memory Game</h1>
      <p className="mb-4 text-lg">Watch the numbers and click them in the same order!</p>

      {/* Display the sequence */}
      <div className="bg-white border-4 border-black text-3xl font-bold py-4 px-6 rounded-lg mb-4">
        {showNumbers ? displaySequence.join(" ") : ""}
      </div>

      {/* Display number buttons */}
      {!showNumbers && (
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((num) => (
            <button
              key={num}
              className="bg-green-500 text-white text-2xl font-bold py-4 px-6 rounded-lg hover:bg-green-600"
              onClick={() => handleNumberClick(num)}
            >
              {num}
            </button>
          ))}
        </div>
      )}

      {/* Display result */}
      {result && (
        <div className="mt-6 text-2xl font-bold text-center">
          <span className="text-3xl">{result.emoji}</span>
          <div>{result.message}</div>
          <div>Score: {((score / sequences.length) * 100).toFixed(0)}%</div>
          <div>Result: {result.value}</div>

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

export default DigitSpanTest;
