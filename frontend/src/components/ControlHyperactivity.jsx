import React, { useState, useEffect, useRef } from "react";
import "../css/ControlHyperactivity.css";
import goImage from "../images/child_face.jpg"; 
import noGo1 from "../images/dog.jpg"; 
import noGo2 from "../images/panda.jpg"; 
import { FaStar } from "react-icons/fa"; 
import { FaArrowLeft } from "react-icons/fa";

const noGoImages = [noGo1, noGo2];

const TOTAL_TRIALS = 56;
const TOTAL_TARGETS = 36;
const TOTAL_NON_TARGETS = 20;
const GAME_DURATION = 120; 
const MAX_ERRORS = 2; 

const ControlHyperactivity = () => {
  const [stimulus, setStimulus] = useState(null);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [trialsLeft, setTrialsLeft] = useState(TOTAL_TRIALS);
  const [score, setScore] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [slideIn, setSlideIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const hasRespondedRef = useRef(false);
  const [showCalmPopup, setShowCalmPopup] = useState(false);

  const commissionErrorsRef = useRef(0); 
  const boxTimeoutRef = useRef(null);
  const gameIntervalRef = useRef(null);
  const isTargetRef = useRef(false); // ✅ Use ref to track isTarget
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

      isTargetRef.current = isTargetStimulus; // ✅ Update ref immediately

      if (isTargetStimulus) {
        remainingTargets.current -= 1;
        setStimulus(goImage);
      } else {
        remainingNonTargets.current -= 1;
        const randomNoGoImage = noGoImages[Math.floor(Math.random() * noGoImages.length)];
        setStimulus(randomNoGoImage);
      }

      setSlideIn(true);
      setErrorMessage("");

      clearTimeout(boxTimeoutRef.current);

      let delay = 2100; // Default time before moving to the next stimulus

      // Apply a random 2-second delay for some non-targets (50% chance)
      if (!isTargetStimulus && Math.random() < 0.5) {
        delay += 2500; 
    }

      if (trialsLeft > 1) {
        boxTimeoutRef.current = setTimeout(() => {
          setTrialsLeft((prev) => {
            if (prev - 1 <= 0) {
              endGame();
              return 0;
            }
            return prev - 1;
          });
          nextStimulus();
        }, delay);
      } else {
        endGame();
      }
    }, 100);
  };

  const startGame = () => {
    clearInterval(gameIntervalRef.current); // ✅ Clear any previous interval
    setIsGameRunning(true);
    setGameOver(false);
    setShowCalmPopup(false);
    setTimeLeft(GAME_DURATION);
    setTrialsLeft(TOTAL_TRIALS);
    setScore(0);
    commissionErrorsRef.current = 0;

    remainingTargets.current = TOTAL_TARGETS;
    remainingNonTargets.current = TOTAL_NON_TARGETS;
    isTargetRef.current = false; // ✅ Reset ref on start

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

    hasRespondedRef.current = true; // Prevents holding down spacebar from triggering multiple times
    
    if (isTargetRef.current) {
      setScore((prevScore) => prevScore + 10);
      setErrorMessage("");
    } else {
      setScore((prevScore) => prevScore - 10);
      commissionErrorsRef.current += 1;

      if (commissionErrorsRef.current > MAX_ERRORS) {
        setShowCalmPopup(true);
        setIsGameRunning(false);
        setTimeout(() => {
          setShowCalmPopup(false);
          startGame();
        }, 5000);
        return;
      }

      setErrorMessage("Wrong Response! Don't press for No-Go stimuli.");
      setIsError(true);
    }

    setTrialsLeft((prev) => {
      if (prev - 1 <= 0) {
        endGame();
        return 0;
      }
      return prev - 1;
    });
    nextStimulus();
  };

  // ✅ Reset the flag when the key is released
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
    }, [isGameRunning]);

  const endGame = () => {
    setIsGameRunning(false);
    setGameOver(true);
    clearTimeout(boxTimeoutRef.current);
    clearInterval(gameIntervalRef.current);
  };

  return (
    <div className="game-wrapper">
      {!isGameRunning && !gameOver && !showCalmPopup && (
        <div className="start-screen">
          {/* Back Icon */}
              <div className="back-container2" onClick={() => window.history.back()}>
                <span className="back-icon"><FaArrowLeft /></span> 
              </div>
          <h1>Control Hyperactivity Task</h1>
          <div className="go-stimulus-container"> 
      <img className="go-stimulus" src={goImage} alt="Go Stimulus" />
    </div>
          <p className="instructions">
            Press the <b>spacebar</b> when you see a <b>Child's Face. </b>  
            <b>Do not</b> press any key when you see a <b>animal</b>.  
            The game will run for <b>56 trials</b>and last <b>2 minutes</b>.  
          </p>
          

          <button className="start-button" onClick={startGame}>
            Start Game
          </button>
        </div>
      )}

      {isGameRunning && (
        <div className="game-container">
          <div className="stimulus-container">
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <img className={`stimulus ${slideIn ? "slide-in" : ""}`} src={stimulus} alt="stimulus" />
          </div>
          <h2>Time Left: {timeLeft}s</h2>
          <h2>Trials Left: {trialsLeft}/56</h2>
          <div className="score-display">
            <b>
            <span className="star-icon">⭐</span> Your Score: {score}
            </b>
          </div>
        </div>
      )}
      {gameOver && (
        <div className="results-screen">
          <h2>Excellent performance!</h2>
    
          <div className="score-display">
            <b>
            <span className="star-icon">⭐</span> Your Score: {score}
            </b>
          </div>
          <br></br>
          <button className="start-button" onClick={() => window.location.href = '/control-impulsiveness'}>Restart</button><br></br><br></br>
          <button className="retest-button" onClick={() => window.location.href = '/go'}>Retest</button>
        </div>
      )}

      {showCalmPopup && ( 
        <div className="game-over-popup">
          <h2>Take a deep breath! Try again in 5 seconds.</h2>
        </div>
      )}
    </div>
  );
};

export default ControlHyperactivity;
