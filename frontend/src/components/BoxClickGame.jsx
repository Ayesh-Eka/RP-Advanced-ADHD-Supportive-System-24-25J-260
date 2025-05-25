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
            Engaging in activities that improve concentration and attention span could be beneficial.</b> <br/><hr class="my-4 border-t-2 border-gray-600" />
            ඔබේ දරුවා අවධානය යොමු කිරීමේ අපහසුතා පෙන්නුම් කරයි.
            අවධානය යොමු කිරීමේ කාලය වැඩි දියුණු කරන ක්‍රියාකාරකම්වල යෙදීම ප්‍රයෝජනවත් විය හැකිය.
            යෝජිත ක්‍රියාකාරකම් බැලීමට "Click here" යන වචනය මත ක්ලික් කරන්න.<br/><br/><Link to="/attention-advice" className="click-here1">Click here</Link> to see suggested activity.
        </p>
      );
    case "High Impulsivity":
      return (
        <p><b>Your child exhibits signs of hyperactivity levels and impulsiveness. 
          They may find it challenging to sit still or wait for turns. 
          Activities that promote self-control and patience can help.</b> <br/><hr class="my-4 border-t-2 border-gray-600" />
          ඔබේ දරුවා අධි ක්‍රියාකාරීත්වයේ සහ ආවේගශීලීත්වයේ ලක්ෂණ පෙන්නුම් කරයි. ඔවුන්ට වාඩි වී 
            සිටීම හෝ වාරය එනතුරු බලා සිටීම අභියෝගාත්මක විය හැකිය. 
            ස්වයං පාලනය සහ ඉවසීම ප්‍රවර්ධනය කරන ක්‍රියාකාරකම් උපකාරී විය හැකිය.යෝජිත ක්‍රියාකාරකම් බැලීමට "Click here" යන වචනය මත ක්ලික් කරන්න.<br/><br/><Link to="/hyperactivity-advice" className="click-here1">Click here</Link> to see suggested activity.
        </p>
      );
    case "Combined Deficits":
      return (
        <p><b>Your child shows signs of both attention difficulties and hyperactivity. 
          They may struggle with focus and staying still for extended periods. 
          Focus-based exercises and calming activities can support their development</b> <br/><hr class="my-4 border-t-2 border-gray-600" />
          ඔබේ දරුවා අවධානය යොමු කිරීමේ අපහසුතා සහ අධි ක්‍රියාකාරීත්වය යන දෙකෙහිම ලක්ෂණ පෙන්නුම් කරයි. ඔවුන්ට අවධානය යොමු කිරීමට සහ දිගු වේලාවක් නිශ්චලව සිටීමට අපහසු විය හැකිය. 
          අවධානය යොමු කිරීම පදනම් කරගත් ව්‍යායාම සහ සන්සුන් කිරීමේ ක්‍රියාකාරකම් ඔවුන්ගේ වර්ධනයට සහාය විය හැකිය.යෝජිත ක්‍රියාකාරකම් බැලීමට "Click here" යන වචනය මත ක්ලික් කරන්න.<br/><br/> <Link to="/combine-advice" className="click-here1">Click here</Link> to see suggested activity.
        </p>
      );
    case "None":
      return <p><b>Excellent performance! Your child’s cognitive skills are well-developed, and did a great job!</b>
       <br/> <hr class="my-4 border-t-2 border-gray-600" />
       විශිෂ්ට කාර්ය සාධනයක්! ඔබේ දරුවාගේ සංජානන කුසලතා හොඳින් වර්ධනය වී ඇති අතර, විශිෂ්ට කාර්යයක් කළා!<br/><br/></p>;
    default:
      return <p>Processing results...</p>;
  }
};


  useEffect(() => {

    const handleSpacebar = (event) => {
      if (event.code === "Space") {
        event.preventDefault(); // Stop the page from scrolling
      }
    };

    

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
    <div >
      {!isGameRunning && !gameOver && (
        <div className="flex justify-center items-center min-h-[190vh] bg-gradient-to-r from-blue-200 via-purple-200 to-purple-300 py-20">
        <div className="bg-[#F5F1E9] p-5 rounded-lg shadow-2xl text-center max-w-[1100px] w-full  relative">
          {/* Optional Animal Images */}
          {/* <img className="absolute top-5 left-5 w-[400px] z-0" src={animal1} alt="Animal 1" />
          <img className="absolute bottom-5 right-5 w-[400px] z-0" src={animal4} alt="Animal 4" /> */}

          <div className="bg-[#F5F1E9] p-5 rounded-lg z-10 relative">
            <h1 className="text-3xl font-bold text-purple-600 mb-7">Welcome to the Cognitive Assessment!</h1>

            

            <p className="text-[16px] text-brown-800 bg-[#F5F1E9] p-3 rounded-md mb-4 text-left leading-relaxed">
              <div className="flex justify-center items-center font-bold mb-4">•  You will see a series of images displayed one at a time on the screen. Press the spacebar when you see a child’s face as quickly and accurately as you can. / ඔබට තිරය මත එකින් එක රූප මාලාවක් පෙනෙනු ඇත. ළමා මුහුණක් දුටු විට පමණක් ඔබට හැකි ඉක්මනින් space bar එක ඔබන්න.
              </div>  
              <div className="flex justify-center items-center mb-4">
              <img className="w-28 h-28 rounded-full object-cover border-4 border-green-500" src={targetImg} alt="Go Stimulus" />
            </div>   <br />
            <div className="flex justify-center font-bold items-center mb-4"> •	Do not press any key when you see an animal. Stay still and wait for the next image.A new image will appear right after, so be ready to watch carefully again. /
            සතෙකු දුටු විට කිසිදු යතුරක් ඔබන්න එපා. නිශ්චලව සිට ඊළඟ රූපය එනතෙක් රැඳී සිටින්න. එබැවින් නැවත සූදානම්ව සිටින්න.
              </div> 

              <div className="flex justify-center items-center mb-4">
              <img className="w-28 h-28 rounded-full object-cover border-4 border-green-500 mx-6" src={animal1} alt="No-Go Stimulus" />
              <img className="w-28 h-28 rounded-full object-cover border-4 border-green-500 mx-6" src={animal2} alt="No-Go Stimulus" />
              <img className="w-28 h-28 rounded-full object-cover border-4 border-green-500 mx-6" src={animal3} alt="No-Go Stimulus" />
              <img className="w-28 h-28 rounded-full object-cover border-4 border-green-500 mx-6" src={animal4} alt="No-Go Stimulus" />
              <img className="w-28 h-28 rounded-full object-cover border-4 border-green-500 mx-6" src={animal5} alt="No-Go Stimulus" />
            </div>   <br />
           
              <br />
              <b>Tips for parents:</b><br /> Teach your child the above tips.The game has <b>56 trials</b> and lasts for <b>2 minutes</b>.  
              Encourage your child to respond as <b>quickly</b> and <b>accurately</b> as possible. Suitable for children under 12 years old.<br /><br />
              
              <b>Why is this important?</b><br />
              This test helps us identify your child's attention and impulse control skills.  
              Based on their performance, we will suggest activities to help strengthen their focus and self-control.

              <hr class="my-4 border-t-2 border-gray-600" /><br />
            
              <b>දෙමාපියන් සඳහා උපදෙස්:</b><br /> ඉහත උපදෙස් ඔබේ දරුවාට උගන්වන්න. 
ක්‍රීඩාවට <b>වාර 56</b> ක් ඇති අතර එය <b>මිනිත්තු 2 ක් </b> පවතී. <b>හැකි ඉක්මනින්</b> සහ <b>නිවැරදිව</b> ප්‍රතිචාර දැක්වීමට ඔබේ දරුවා දිරිමත් කරන්න. වයස අවුරුදු 12 ට අඩු දරුවන්ට වඩා ප්‍රායෝගික වේ.

              <br /><br />

              <b>මෙය වැදගත් වන්නේ ඇයි?</b><br />
              මෙම පරීක්ෂණය ඔබේ දරුවාගේ අවධානය සහ ආවේග පාලන කුසලතා හඳුනා ගැනීමට උපකාරී වේ.
              ඔවුන්ගේ කාර්ය සාධනය මත පදනම්ව, ඔවුන්ගේ අවධානය සහ ස්වයං පාලනය ශක්තිමත් කිරීමට උපකාරී වන ක්‍රියාකාරකම් අපි යෝජනා කරන්නෙමු.
            </p>

            

            <div className="mb-4">
              <input 
                type="number" 
                placeholder="Enter Age" 
                value={age} 
                onChange={(e) => setAge(e.target.value)} 
                min="1" 
                max="13"
                required 
                className="w-[500px] p-3 text-base shadow-xl border-2 border-gray-500 rounded-md bg-white text-gray-800"
              />
            </div>

            <div className="mb-4">
              <select 
                value={gender} 
                onChange={(e) => setGender(e.target.value)} 
                required 
                className="w-[500px] p-3 text-base border-2 border-gray-500 rounded-md shadow-xl bg-white text-gray-800"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <br></br>
           
            <button 
              className={`w-[30%] py-3 text-lg text-white rounded-md transition ${
                !age || !gender ? "bg-gray-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 cursor-pointer"
              }`}
              onClick={startGame}
              disabled={!age || !gender}
            >
              Start Game
            </button>
            </div> 
        </div>
        </div>
      )}
     
   
  {isGameRunning && (
  <div className="flex justify-center items-center min-h-[90vh] bg-gradient-to-r from-blue-200 via-purple-200 to-purple-300  py-20">
  <div className="text-center bg-[#F5F1E9] p-5 w-[500px] h-[400px] rounded-lg shadow-md border-4 border-transparent transition-all duration-300" >
  <div className="flex flex-col justify-center items-center h-[240px] bg-[#F5F1E9] p-5">
    {errorMessage && <p className="text-red-500 text-lg mb-2">{errorMessage}</p>}
      <img className={`stimulus ${slideIn ? "slide-in" : ""}`} src={stimulus} alt="stimulus" />
    </div>
    <br></br>
    <b><h2 className="text-lg font-bold mb-2">Time Left: {timeLeft}s</h2>
    <h2 className="text-lg font-bold mb-4">Trials Left: {trialsLeft}/56</h2></b>
  </div>
  </div>
)}

  
{gameOver && (
  <div className="flex justify-center items-center min-h-[105vh] bg-gradient-to-r from-blue-200 via-purple-200 to-purple-300  py-20">
        <div className="bg-[#F5F1E9] p-5 text-[17px] rounded-lg shadow-2xl text-center  max-w-[800px]  mx-auto mt-8">
          <h2 className="text-purple-600 mb-4 text-3xl font-bold">Thank You</h2><br/>
          <p className="text-gray-700  ">Age: {age}</p>
          <p className="text-gray-700 ">Gender: {gender}</p>
          <p className="text-gray-700 ">Errors of Omission: {omissionErrorsRef.current}</p>
          <p className="text-gray-700 ">Errors of Commission: {commissionErrorsRef.current}</p>
          <p className="text-gray-700 ">
            Average Reaction Time: {
              (reactionTimesRef.current.length > 0
                ? (reactionTimesRef.current.reduce((sum, time) => sum + time, 0) / reactionTimesRef.current.length).toFixed(2)
                : "0.00")
            } ms
          </p>
          <div ><p className="font-semibold mt-4">Cognitive Defects: {adhdLevel}</p><br/>
          <div className="" >{renderRecommendation()}</div></div> <br/>
          

          <button 
            className="bg-green-600 text-white px-4 w-[30%] py-3 text-lg rounded-md mt-4 hover:bg-green-700 transition"
            onClick={() => window.location.reload()}
          >
            Retest
          </button><br/>
        </div>
        </div>
      )}
      
    </div>

  );
  
};

export default BoxClickGame;