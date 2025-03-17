import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/TrainAttentionHyperactivity.css"; // ✅ Import CSS for styling
import { FaArrowLeft } from "react-icons/fa";

const TrainAttentionHyperactivity = () => {
  const navigate = useNavigate();

  return (
    <div className="train-container">
      <div className="train-box"> 
         {/* Back Icon */}
         <div className="back-container4" onClick={() => window.history.back()}>
        <span className="back-icon"><FaArrowLeft /></span> 
        </div>
        <br></br>
        <div className="training-box">
        <b><h2 style={{color:"#6a5acd"}}>Boost Attention and Impulse Regulation</h2></b>
        </div>
       
        <div className="instruction4"><p>
        Below, we suggest <b>two training activities</b>. 
        Choose one and let your child play.
        After completing the game, if you wish, <b>you can take the screening test again</b> or try the second cognitive activity.
        </p>
        </div>
        <div className="button-group">
          <button className="game-button1" onClick={() => navigate("/improve-attention")}>
            Play Improve Attention Task
          </button>
          <button className="game-button2" onClick={() => navigate("/control-impulsiveness")}>
            Play Control Hyperactivity Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrainAttentionHyperactivity;
