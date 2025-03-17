import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import FinalizedReport from "./FinalizedRepost"

const FollowInstructionsGame = () => {
  const instructions = [
    { objects: ["Red", "Blue", "Green"], order: ["Red", "Blue", "Green"] },
    { objects: ["Yellow", "Red", "Blue"], order: ["Blue", "Yellow", "Red"] },
    { objects: ["Green", "Yellow", "Red", "Blue"], order: ["Green", "Red", "Blue", "Yellow"] },
    { objects: ["Blue", "Green", "Yellow", "Red"], order: ["Yellow", "Blue", "Red", "Green"] },
    { objects: ["Red", "Yellow", "Blue", "Green"], order: ["Red", "Yellow", "Green", "Blue"] },
  ];

  const colorMapping = {
    Red: "bg-red-500",
    Blue: "bg-blue-500",
    Green: "bg-green-500",
    Yellow: "bg-yellow-500",
  };

  const [currentInstructionIndex, setCurrentInstructionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userOrder, setUserOrder] = useState([]);
  const [timeLeft, setTimeLeft] = useState(20); // Set time to 20 seconds
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [result, setResult] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false); // Track if the game has started
  const [clickedObjects, setClickedObjects] = useState([]); // Track clicked objects

  useEffect(() => {
    if (gameStarted && tasksCompleted < 5) { // Ensure 5 tasks are completed
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleTimeOut();
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [tasksCompleted, gameStarted]);

  // Handle user clicking an object
  const handleObjectClick = (object) => {
    setClickedObjects((prev) => [...prev, object]); // Add clicked object to the list
    setUserOrder((prev) => {
      const newOrder = [...prev, object];
      if (newOrder.length === instructions[currentInstructionIndex].order.length) {
        checkAnswer(newOrder);
      }
      return newOrder;
    });
  };

  // Check if the user's order matches the correct order
  const checkAnswer = (newOrder) => {
    const correctOrder = instructions[currentInstructionIndex].order;
    if (JSON.stringify(newOrder) === JSON.stringify(correctOrder)) {
      setScore((prev) => prev + 1);
    }
    moveToNextInstruction();
  };

  // Move to the next instruction
  const moveToNextInstruction = () => {
    setUserOrder([]);
    setClickedObjects([]); // Reset clicked objects
    setTasksCompleted((prev) => prev + 1);
    setTimeLeft(20);

    if (tasksCompleted === 4) { // Check if all 5 tasks are completed
      showResult();
    } else {
      setCurrentInstructionIndex((prev) => prev + 1);
    }
  };

  // Handle timeout
  const handleTimeOut = () => {
    setTasksCompleted((prev) => prev + 1);
    setUserOrder([]);
    setClickedObjects([]); // Reset clicked objects

    if (tasksCompleted === 4) { // Check if all 5 tasks are completed
      showResult();
    } else {
      setCurrentInstructionIndex((prev) => prev + 1);
      setTimeLeft(20);
    }
  };

  // Show the final result and save it to local storage
  const showResult = () => {
    const percentage = (score / 5) * 100;
    const followingInstructions = percentage < 50 ? 1 : 0; // 1 if score < 50%, else 0
    setResult({
      emoji: percentage < 50 ? "😢" : "😊",
      message: percentage < 50 ? "Let's try again!" : "Very Good!",
      score: `${percentage}%`,
    });
    setGameOver(true);

    // Save the result to local storage
    const storedData = JSON.parse(localStorage.getItem("userInputs")) || {};
    storedData.following_instructions = followingInstructions; // Add the result to the stored data
    localStorage.setItem("userInputs", JSON.stringify(storedData));
    console.log("FollowInstructionsGame result saved to local storage:", storedData);
  };

  // Handle "Diagnose" button click
  const handleDiagnoseClick = async () => {
    const storedData = JSON.parse(localStorage.getItem("userInputs")) || {};
    try {
      const response = await axios.post("http://localhost:5000/api/diagnose/predict", storedData, {
        headers: { "Content-Type": "application/json" },
      });
  
      if (response.headers["content-type"].includes("application/json")) {
        const result = response.data;
        Swal.fire({
          title: "Diagnosis Result",
          text: result.prediction === "1" ? "There is a possibility of ADHD" : "ADHD is less likely",
          icon: result.prediction === "1" ? "warning" : "success",
          showCancelButton: true,
          confirmButtonText: "Go to Finalized Report",
          cancelButtonText: "Close",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/finalized-report"); // Navigate to the finalized report page
          }
        });
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to get diagnosis. Please check if the backend is running.",
        icon: "error",
      });
    }
  };

  // Handle "Start Game" button click
  const handleStartGame = () => {
    setGameStarted(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 p-6">
      {/* Frame for the game */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-8">
        <h1 className="text-4xl font-extrabold text-gray-800 text-center drop-shadow-md">
          Follow Instructions Game
        </h1>
        <p className="mt-4 text-lg text-gray-600 text-center font-medium">
          Click the objects in the correct order before time runs out!
        </p>

        {!gameStarted ? (
          <div className="mt-8 text-center">
            <button
              className="px-8 py-3 bg-green-500 text-white text-xl rounded-xl shadow-lg transition-all duration-300 hover:bg-green-600 hover:scale-105 active:scale-95"
              onClick={handleStartGame}
            >
              Start Game
            </button>
          </div>
        ) : !gameOver ? (
          <>
            <div className="mt-8 text-xl font-semibold text-gray-800 text-center">
              {`Click the objects in this order: ${instructions[currentInstructionIndex].order.join(", ")}`}
            </div>
            <div className="flex justify-center gap-6 mt-8">
              {instructions[currentInstructionIndex].objects.map((obj) => (
                <button
                  key={obj}
                  className={`py-4 px-6 text-xl font-bold text-white rounded-lg cursor-pointer ${
                    clickedObjects.includes(obj) ? "opacity-50 blur-sm" : "hover:scale-105"
                  } ${colorMapping[obj]}`}
                  onClick={() => handleObjectClick(obj)}
                  disabled={clickedObjects.includes(obj)} // Disable clicked buttons
                >
                  {obj}
                </button>
              ))}
            </div>
            <div className="mt-6 text-lg text-gray-600 text-center">
              Time left: <span className="font-semibold">{timeLeft}</span> seconds
            </div>
            <div className="mt-6 text-lg text-gray-600 text-center">
              Tasks Completed: <span className="font-semibold">{tasksCompleted} / 5</span>
            </div>
          </>
        ) : (
          <div className="mt-10 text-2xl text-center">
            <span className="text-4xl">{result.emoji}</span>
            <div>{result.message}</div>
            <div>Score: {result.score}</div>
            <button
              className="mt-6 px-8 py-3 bg-blue-600 text-white text-xl rounded-xl shadow-lg transition-all duration-300 hover:bg-blue-700 hover:scale-105 active:scale-95"
              onClick={handleDiagnoseClick}
            >
              Diagnose
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowInstructionsGame;