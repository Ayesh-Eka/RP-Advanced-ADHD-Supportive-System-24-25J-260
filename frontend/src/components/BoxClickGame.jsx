import React, { useState, useEffect, useRef } from "react";
import "../css/BoxClickGame.css";
import "../css/header1.css";
import targetImg from "../images/child_face.jpg";
import animal1 from "../images/animal1.png";
import animal2 from "../images/animal2.png";
import animal3 from "../images/animal3.png";
import animal4 from "../images/animal4.png";
import animal5 from "../images/animal5.png";
import logo1 from "../images/headerLogo.png"
import { Link } from "react-router-dom";

const animalImages = [animal1, animal2, animal3, animal4, animal5];

const TOTAL_TRIALS = 56;
const TOTAL_TARGETS = 36;
const TOTAL_NON_TARGETS = 20;
const GAME_DURATION = 120; // 5 minutes (300 seconds)

const BoxClickGame = () => {
  const [stimulus, setStimulus] = useState(null);
  const [isTarget, setIsTarget] = useState(false);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [trialsLeft, setTrialsLeft] = useState(TOTAL_TRIALS);
  const [errorMessage, setErrorMessage] = useState("");
  const [slideIn, setSlideIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [adhdLevel, setADHDLevel] = useState("");


  const validClicksRef = useRef(0);
  const commissionErrorsRef = useRef(0);
  const omissionErrorsRef = useRef(0);
  const reactionTimesRef = useRef([]);
  const startTimeRef = useRef(null);

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
      if (trialsLeft <= 0) { // Double-check to prevent extra stimulus
        endGame();
        return;
      }
      let isTargetStimulus;
    if (remainingTargets.current > 0 && remainingNonTargets.current > 0) {
      isTargetStimulus = Math.random() < remainingTargets.current / (remainingTargets.current + remainingNonTargets.current);
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

      if (trialsLeft > 1) { // Only allow next stimulus if trials are left
        boxTimeoutRef.current = setTimeout(() => {
          if (isTargetStimulus) {
            omissionErrorsRef.current += 1;
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
        endGame(); // Stop game when last trial is done
      }
    }, 100);
  };

  const startGame = () => {
    setIsGameRunning(true);
    setGameOver(false);
    setTimeLeft(GAME_DURATION);
    setTrialsLeft(TOTAL_TRIALS);
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
  const hasRespondedRef = useRef(false);
  const handleKeyDown = (event) => {
    if (!isGameRunning || event.code !== "Space" || hasRespondedRef.current) return;

    hasRespondedRef.current = true; // Lock further presses immediately

    if (isTarget) {
      const reactionTime = Date.now() - startTimeRef.current;
      reactionTimesRef.current.push(reactionTime);
      validClicksRef.current += 1;
      setErrorMessage("");
    } else {
      commissionErrorsRef.current += 1;
      setErrorMessage("Wrong Response! Do not press for animals.");
      setIsError(true);
    }

    setTrialsLeft((prev) => prev - 1);
    nextStimulus();
  };

  // Reset the lock when spacebar is released
const handleKeyUp = (event) => {
  if (event.code === "Space") {
    hasRespondedRef.current = false;
  }
};

const predictADHDLevel = async () => {
  const requestData = {
    Age: age,
    Gender: gender,
    Omission: omissionErrorsRef.current,
    Commission: commissionErrorsRef.current,
    RT: reactionTimesRef.current.length > 0 
      ? reactionTimesRef.current.reduce((sum, time) => sum + time, 0) / reactionTimesRef.current.length 
      : 0, // Prevent division by zero
  };

  try {
    const response = await fetch("http://localhost:5000/api/cognitive-training/cognitive", { 
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    const data = await response.json();
    console.log("Received response from backend:", data); // Debugging log

    if (data && data["ADHD Level"]) {
      setADHDLevel(data["ADHD Level"]); // ✅ Correct key access
    }
     else {
      setADHDLevel("Prediction Not Available");
    }
    // const data = await response.json();
    // setADHDLevel(data["ADHD Level Prediction"] || "Unknown");
  } catch (error) {
    console.error("Error fetching ADHD prediction:", error);
    setADHDLevel("Prediction failed"); // Handle error case
  }
};

const renderRecommendation = () => {
  switch (adhdLevel) {
    case "Low Attention":
      return (
        <p>
          <b>Your child shows signs of attention difficulties.
            Engaging in activities that improve concentration and attention span could be beneficial.</b> <br/><br/>
            <Link to="/improve-attention">Click here</Link> to see suggested activity.
        </p>
      );
    case "High Impulsivity":
      return (
        <p><b>Your child exhibits signs of high activity levels and impulsiveness. 
          They may find it challenging to sit still or wait for turns. 
          Activities that promote self-control and patience can help.</b> <br/><br/><Link to="/control-impulsiveness">Click here</Link> to see suggested activity.
        </p>
      );
    case "Combined Deficits":
      return (
        <p><b>Your child shows signs of both attention difficulties and hyperactivity. 
          They may struggle with focus and staying still for extended periods. 
          Focus-based exercises and calming activities can support their development</b> <br/><br/> <Link to="/train-attention-hyperactivity">Click here</Link> to see suggested activity.
        </p>
      );
    case "None":
      return <p><b>Excellent performance! Your child’s cognitive skills are well-developed, and they did a great job!</b></p>;
    default:
      return <p>Processing results...</p>;
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
    predictADHDLevel(); // Call function to get ADHD level prediction
  };

  return (
    <div>
    <div className="game-wrapper1">
      {!isGameRunning && !gameOver && (
        <div className="start-screen">
          {/* Animal images placed in corners */}
        {/* <img className="corner-image top-left" src={animal1} alt="Animal 1" />
        <img className="corner-image bottom-right" src={animal4} alt="Animal 1" /> */}

          <div className="start-overlay"> {/* New overlay for readability */}
            <h1>Brain Performance Test</h1>
  
            <div className="go-stimulus-container"> 
                <img className="go-stimulus" src={targetImg} alt="Go Stimulus" />
              </div>

            <p className="instructions">
            Press the <b>spacebar</b> when you see a <b>child’s face</b>.  
            <b>Do not</b> press any key when you see an <b>animal</b>.  

    

            The game has <b>56 trials</b> and lasts for <b>2 minutes</b>.  
            Encourage your child to respond as <b>quickly</b> and <b>accurately</b> as possible.

            <br /> <br />

           <b>Why is this important ?  </b>   <br />
          This test helps us identify your child's attention and impulse control skills.  
          Based on their performance, we will suggest activities to help strengthen their focus and self-control.
            </p>
  
            <div className="input-group1">
              <input 
                type="number" 
                placeholder="Enter Age" 
                value={age} 
                onChange={(e) => setAge(e.target.value)} 
                min="1" 
                max="13" 
                required 
              />
            </div>
            <br></br>
  
            <div className="input-group">
              <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
  
            <button className="start-button" onClick={startGame} disabled={!age || !gender} style={{ backgroundColor: (!age || !gender) ? "#a2a2a2" : "#4CAF50", cursor: (!age || !gender) ? "not-allowed" : "pointer" }}>
              Start Game
            </button>
          </div>
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
  </div>
)}

  
{gameOver && (
  <div className="results-container"> {/* ✅ White box container */}
    <h2>Thank You</h2>
    <p>Age: {age}</p>
    <p>Gender: {gender}</p>
    <p>Errors of Omission: {omissionErrorsRef.current}</p>
    <p>Errors of Commission: {commissionErrorsRef.current}</p>
    <p>Average Reaction Time: {
      (reactionTimesRef.current.length > 0
        ? (reactionTimesRef.current.reduce((sum, time) => sum + time, 0) / reactionTimesRef.current.length).toFixed(2)
        : "0.00") // Prevent division by zero 
    } ms</p>

    {/* New section to display ADHD level prediction */}
    <p><strong>Cognitive Defects:</strong> {adhdLevel}</p> <br/>

     {/* Display personalized recommendation */}
     <div className="recommendation">{renderRecommendation()}</div>

    <button className="restart-button" onClick={() => window.location.reload()}>Retest</button>
  </div>
)}

    </div>

    </div>
  );
  
};

export default BoxClickGame;