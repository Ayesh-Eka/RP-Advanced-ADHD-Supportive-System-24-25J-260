import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/TrainAttentionHyperactivity.css"; // ✅ Import CSS for styling
import { FaArrowLeft } from "react-icons/fa";

const TrainAttentionHyperactivity = () => {
  const navigate = useNavigate();

  return (
    <div className="train-container">
      <div className="train-box"> 
        <h2>Boost Attention and Impulse Regulation</h2>
        {/* Back Icon */}
        <div className="back-container" onClick={() => window.history.back()}>
        <span className="back-icon"><FaArrowLeft /></span> 
        </div>
        <p>
        Below, we suggest two training activities. 
        Choose one and let your child play.
        After completing the game, if you wish, you can take the screening test again or try the second cognitive activity.
        </p>
        <div className="button-group">
          <button className="game-button" onClick={() => navigate("/improve-attention")}>
            Play Improve Attention Task
          </button>
          <button className="game-button" onClick={() => navigate("/control-impulsiveness")}>
            Play Control Hyperactivity Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrainAttentionHyperactivity;
