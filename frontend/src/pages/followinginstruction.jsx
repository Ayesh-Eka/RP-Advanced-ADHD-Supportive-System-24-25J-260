import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

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
  const [timeLeft, setTimeLeft] = useState(15);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [result, setResult] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (tasksCompleted < 5) {
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
  }, [tasksCompleted]);

  // Handle user clicking an object
  const handleObjectClick = (object) => {
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
    setTasksCompleted((prev) => prev + 1);
    setTimeLeft(15);

    if (tasksCompleted === 4) {
      showResult();
    } else {
      setCurrentInstructionIndex((prev) => prev + 1);
    }
  };

  // Handle timeout
  const handleTimeOut = () => {
    setTasksCompleted((prev) => prev + 1);
    setUserOrder([]);

    if (tasksCompleted === 4) {
      showResult();
    } else {
      setCurrentInstructionIndex((prev) => prev + 1);
      setTimeLeft(15);
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
          text: result.prediction === "1" ? "Positive for ADHD" : "Negative for ADHD",
          icon: result.prediction === "1" ? "warning" : "success",
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

  return (
    <div className="font-sans text-center mt-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl text-gray-800">Follow Instructions Game</h1>
      <p className="mt-4 text-lg">Click the objects in the correct order before time runs out!</p>

      {!gameOver ? (
        <>
          <div className="mt-4 text-xl font-semibold">
            {`Click the objects in this order: ${instructions[currentInstructionIndex].order.join(", ")}`}
          </div>
          <div className="flex justify-center gap-6 mt-8">
            {instructions[currentInstructionIndex].objects.map((obj) => (
              <button
                key={obj}
                className={`py-4 px-6 text-xl font-bold text-white rounded-lg cursor-pointer ${colorMapping[obj]}`}
                onClick={() => handleObjectClick(obj)}
              >
                {obj}
              </button>
            ))}
          </div>
          <div className="mt-6 text-lg text-gray-600">
            Time left: <span className="font-semibold">{timeLeft}</span> seconds
          </div>
          <div className="mt-6 text-lg text-gray-600">
            Tasks Completed: <span className="font-semibold">{tasksCompleted} / 5</span>
          </div>
        </>
      ) : (
        <div className="mt-10 text-2xl">
          <span className="text-4xl">{result.emoji}</span>
          <div>{result.message}</div>
          <div>Score: {result.score}</div>
          <button
            className="mt-6 px-6 py-3 bg-blue-600 text-white text-lg font-bold rounded-lg hover:bg-blue-700"
            onClick={handleDiagnoseClick}
          >
            Diagnose
          </button>
        </div>
      )}
    </div>
  );
};

export default FollowInstructionsGame;