import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DigitSpanTest = () => {
  const sequences = [
    [1, 2],
    [3, 4],
    [2, 1],
    [4, 3],
    [1, 3],
  ];

  const colors = ["red", "blue", "green", "yellow"]; // Same colors as StroopTest
  const [currentSequenceIndex, setCurrentSequenceIndex] = useState(0);
  const [displaySequence, setDisplaySequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [score, setScore] = useState(0);
  const [showNumbers, setShowNumbers] = useState(true);
  const [result, setResult] = useState(null);
  const [clickedNumbers, setClickedNumbers] = useState([]); // Track clicked numbers

  const navigate = useNavigate();

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
    setClickedNumbers((prev) => [...prev, number]); // Add clicked number to the list

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
    setClickedNumbers([]); // Reset clicked numbers for the next sequence
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 p-6">
      {/* Frame for the game */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-8">
        <h1 className="text-4xl font-extrabold text-gray-800 text-center drop-shadow-md">
          Number Memory Game
        </h1>
        <p className="text-lg text-gray-600 mt-2 text-center font-medium">
          Watch the numbers and click them in the same order!
        </p>

        {/* Display the sequence */}
        <div className="mt-8 bg-gray-50 border-4 border-gray-200 text-7xl font-extrabold py-6 px-8 rounded-xl text-center">
          {showNumbers ? displaySequence.join(" ") : ""}
        </div>

        {/* Display number buttons */}
        {!showNumbers && (
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((num) => (
              <button
                key={num}
                className={`text-4xl font-bold py-6 px-8 rounded-xl shadow-lg transition-all duration-300 ${
                  clickedNumbers.includes(num)
                    ? "opacity-50 blur-sm" // Blur and reduce opacity for clicked numbers
                    : "hover:scale-105 active:scale-95"
                }`}
                style={{ backgroundColor: colors[num - 1] }} // Assign colors based on number
                onClick={() => handleNumberClick(num)}
                disabled={clickedNumbers.includes(num)} // Disable clicked buttons
              >
                {num}
              </button>
            ))}
          </div>
        )}

        {/* Display result */}
        {result && (
          <div className="mt-12 text-center text-3xl font-bold text-gray-800">
            <span className="text-6xl">{result.emoji}</span>
            <div className="mt-4">{result.message}</div>
            <div className="mt-2 text-2xl">
              Score: {((score / sequences.length) * 100).toFixed(0)}%
            </div>

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

export default DigitSpanTest;