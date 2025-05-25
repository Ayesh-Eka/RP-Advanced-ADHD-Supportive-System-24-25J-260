import React, { useState, useEffect, useRef } from "react";
import "../css/ImproveAttentionTask.css";
import targetImg from "../images/elephant.jpg";
import animal1 from "../images/bear.jpg";
import animal2 from "../images/dog.jpg";
import animal3 from "../images/hipo.jpg";
import animal4 from "../images/panda.jpg";
import animal5 from "../images/rabbit.jpg";
import { FaArrowLeft } from "react-icons/fa";

// Icon imports (Assuming you use FontAwesome or any icon library)
import { FaStar, FaTrophy } from "react-icons/fa";

const animalImages = [animal1, animal2, animal3, animal4, animal5];

const TOTAL_TRIALS = 56;
const TOTAL_TARGETS = 36;
const TOTAL_NON_TARGETS = 20;
const GAME_DURATION = 120; // 2 minutes
const MAX_ERRORS = 5; // Maximum allowed commission or omission errors before ending the game


const ImproveAttentionTask = () => {
  const [stimulus, setStimulus] = useState(null);
  const [isTarget, setIsTarget] = useState(false);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [trialsLeft, setTrialsLeft] = useState(TOTAL_TRIALS);
  const [score, setScore] = useState(0); // Score state
  const [errorMessage, setErrorMessage] = useState("");
  const [slideIn, setSlideIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isGameOverDueToErrors, setIsGameOverDueToErrors] = useState(false); // New state for error-based game over
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [adhdLevel, setADHDLevel] = useState("");

  const validClicksRef = useRef(0);
  const commissionErrorsRef = useRef(0);
  const omissionErrorsRef = useRef(0);
  const reactionTimesRef = useRef([]);
  const startTimeRef = useRef(null);
  const hasRespondedRef = useRef(false);

  const boxTimeoutRef = useRef(null);
  const gameIntervalRef = useRef(null);
  let remainingTargets = useRef(TOTAL_TARGETS);
  let remainingNonTargets = useRef(TOTAL_NON_TARGETS);

  const nextStimulus = () => {
    if (trialsLeft <= 0) {
      endGame();
      return;
    }

    setSlideIn(false);
    setIsError(false);

    setTimeout(() => {
      if (trialsLeft <= 0) {
        endGame();
        return;
      }

      let isTargetStimulus;
      if (remainingTargets.current > 0 && remainingNonTargets.current > 0) {
        isTargetStimulus =
          Math.random() < remainingTargets.current / (remainingTargets.current + remainingNonTargets.current);
      } else {
        isTargetStimulus = remainingTargets.current > 0;
      }

      if (isTargetStimulus) {
        remainingTargets.current -= 1;
        setIsTarget(true);
        setStimulus(targetImg);
      } else {
        remainingNonTargets.current -= 1;
        setIsTarget(false);
        setStimulus(animalImages[Math.floor(Math.random() * animalImages.length)]);
      }

      setSlideIn(true);
      setErrorMessage("");
      startTimeRef.current = Date.now();

      clearTimeout(boxTimeoutRef.current);

      if (trialsLeft > 1) {
        boxTimeoutRef.current = setTimeout(() => {
            if (isTargetStimulus) {
                omissionErrorsRef.current += 1;
    
                // Check if omission errors exceed the limit
                if (omissionErrorsRef.current >= MAX_ERRORS) {
                  setIsGameOverDueToErrors(true);
                  endGame();
                  return;
                }
              }
          setTrialsLeft((prev) => {
            if (prev - 1 <= 0) {
              endGame(); // Ensure game ends when last trial is completed
              return 0;
            }
            return prev - 1;
          });
          nextStimulus();
        }, 2100);
      } else {
        endGame();
      }
    }, 100);
  };

  const startGame = () => {
    setIsGameRunning(true);
    setGameOver(false);
    setIsGameOverDueToErrors(false); // Reset error-based game over state
    setTimeLeft(GAME_DURATION);
    setTrialsLeft(TOTAL_TRIALS);
    setScore(0); // Reset score at start
    validClicksRef.current = 0;
    commissionErrorsRef.current = 0;
    omissionErrorsRef.current = 0;
    reactionTimesRef.current = [];

    remainingTargets.current = TOTAL_TARGETS;
    remainingNonTargets.current = TOTAL_NON_TARGETS;

    setErrorMessage("");
    setIsError(false);
    nextStimulus();

    gameIntervalRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(gameIntervalRef.current);
          endGame();
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const handleKeyDown = (event) => {
    if (!isGameRunning || event.code !== "Space" || hasRespondedRef.current) return;

    hasRespondedRef.current = true;

    if (isTarget) {
      setScore((prevScore) => prevScore + 10); // Increase score on correct response
      const reactionTime = Date.now() - startTimeRef.current;
      reactionTimesRef.current.push(reactionTime);
      validClicksRef.current += 1;
      setErrorMessage("");
    } else {
      setScore((prevScore) => prevScore - 10); // Decrease score on incorrect response
      commissionErrorsRef.current += 1;

      // ✅ Check if commission errors exceed the limit
      if (commissionErrorsRef.current >= MAX_ERRORS) {
        setIsGameOverDueToErrors(true);
        endGame();
        return;
      }

      setErrorMessage("Wrong Response! Do not press for animals.");
      setIsError(true);
    }

    setTrialsLeft((prev) => {
        if (prev - 1 <= 0) {
          endGame(); // Ensure game ends when last trial is completed
          return 0;
        }
        return prev - 1;
      });
    nextStimulus();
  };

  const handleKeyUp = (event) => {
    if (event.code === "Space") {
      hasRespondedRef.current = false;
    }
  };

  useEffect(() => {
    if (isGameRunning) {
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);
    } else {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isGameRunning, isTarget]);

  const endGame = () => {
    setIsGameRunning(false);
    setGameOver(true);
    clearTimeout(boxTimeoutRef.current);
    clearInterval(gameIntervalRef.current);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-200 via-purple-200 to-purple-300">
    {!isGameRunning && !gameOver && (
      <div className="bg-[#F5F1E9] p-5 rounded-lg shadow-lg max-w-md w-full border-4 border-green-200 text-center mx-auto">
        <br />
        <h1 className="text-2xl font-bold text-purple-600 mb-5">Attention Improving Game</h1>
        <div className="flex justify-center items-center mb-4">
          <img
            className="w-20 h-20 rounded-full object-cover border-4 border-green-600"
            src={targetImg}
            alt="Go Stimulus"
          />
        </div>
        <p className="text-left text-brown-700 bg-yellow-100 p-3 rounded mb-4 leading-relaxed" style={{ color: '#5c4033', backgroundColor: '#fde9c9' }}>
          Press the <b>spacebar</b> when you see a <b>Elephant.</b>{' '}
          <b>Do not</b> press any key when you see other <b>animals</b>. The game will run for{' '}
          <b>56 trials</b> for <b>2 minutes</b>. Try to respond as quickly and accurately as possible.
        </p>
        <button
          className="w-full py-3 text-lg bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-200 disabled:cursor-not-allowed transition"
          onClick={startGame}
          disabled={false /* adjust if needed */}
        >
          Start Game
        </button>
      </div>
    )}

      {isGameRunning && (
        <div className="text-center bg-white p-5 w-[500px] h-[410px] rounded-lg shadow-md border-2 border-transparent transition-all duration-300">
        <div className="flex flex-col items-center justify-center h-[240px] bg-white p-5">
            {errorMessage && <p className="error-message3">{errorMessage}</p>}
            <img className={`stimulus ${slideIn ? "slide-in" : ""}`} src={stimulus} alt="stimulus" />
          </div>
          <br/>
          <h2 className="mb-2 font-bold text-xl">Time Left: {timeLeft}s</h2>
        <h2 className="mb-4 font-bold text-xl">Trials Left: {trialsLeft}/56</h2>
        <div className="mt-5 font-bold text-xl flex items-center justify-center space-x-2">
          <span className="text-yellow-400 text-2xl">⭐</span> Score: {score}
        </div>
        <br />
      </div>
    )}

    {gameOver && !isGameOverDueToErrors && (
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#F5F1E9] border-4 border-green-200 p-7 w-[400px] rounded-lg shadow-md text-center animate-fadeIn">
        <h2 className="text-2xl font-bold text-purple-600 mb-5">Excellent performance!</h2>
        <div className="font-bold text-xl flex items-center justify-center space-x-2 mb-5">
          <span className="text-yellow-400 text-2xl">⭐</span> Your Score: {score}
        </div>
        <br />
        <div className="flex space-x-4 justify-center">
          <button
            className="flex-1 bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
            onClick={() => window.location.href = '/improve-attention'}
          >
            Restart
          </button>
          <button
            className="flex-1 bg-blue-400 text-white py-3 rounded hover:bg-blue-500 transition"
            onClick={() => window.location.href = '/go'}
          >
            Retest
          </button>
        </div>
      </div>
    )}

    {isGameOverDueToErrors && (
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#F5F1E9] border-4 border-green-200 p-7 w-[480px] h-[200px] rounded-lg shadow-md text-center animate-fadeIn">
        <h2 className="text-3xl font-bold text-purple-600 mb-4">Game Over!</h2><br/>
        <div className="flex space-x-4 justify-center">
          <button
            className="flex-1 bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
            onClick={startGame}
          >
            Play Again
          </button>
          <button
            className="flex-1 bg-blue-400 text-white py-3 rounded hover:bg-blue-500 transition"
            onClick={() => window.location.href = '/go'}
          >
            Play Later
          </button>
        </div>
      </div>
    )}
  </div>
  );
};

export default ImproveAttentionTask;