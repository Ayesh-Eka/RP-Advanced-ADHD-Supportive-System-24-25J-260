import React, { useState, useEffect } from "react";

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

  useEffect(() => {
    showSequence();
  }, [currentSequenceIndex]);

  const showSequence = () => {
    setDisplaySequence(sequences[currentSequenceIndex]);
    setShowNumbers(true);
    setTimeout(() => {
      setShowNumbers(false);
    }, 2000);
  };

  const handleNumberClick = (number) => {
    const newUserSequence = [...userSequence, number];
    setUserSequence(newUserSequence);

    if (newUserSequence.length === sequences[currentSequenceIndex].length) {
      checkAnswer(newUserSequence);
    }
  };

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

  const showFinalResult = () => {
    const percentage = (score / sequences.length) * 100;
    setResult(percentage >= 50 ? { emoji: "😊", message: "Very Good!", value: 0 } : { emoji: "😢", message: "Let's try again!", value: 1 });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Number Memory Game</h1>
      <p className="mb-4 text-lg">Watch the numbers and click them in the same order!</p>
      <div className="bg-white border-4 border-black text-3xl font-bold py-4 px-6 rounded-lg mb-4">
        {showNumbers ? displaySequence.join(" ") : ""}
      </div>
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
      {result && (
        <div className="mt-6 text-2xl font-bold text-center">
          <span className="text-3xl">{result.emoji}</span>
          <div>{result.message}</div>
          <div>Score: {((score / sequences.length) * 100).toFixed(0)}%</div>
          <div>Result: {result.value}</div>
        </div>
      )}
    </div>
  );
};

export default DigitSpanTest;
