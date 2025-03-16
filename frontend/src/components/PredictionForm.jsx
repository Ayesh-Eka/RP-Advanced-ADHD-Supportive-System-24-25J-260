import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import StroopTest from "../pages/stroop"; // Import the StroopTest component


const PredictionForm = () => {
    const [formData, setFormData] = useState({
        age: "", // Initially empty, so the input is not constrained to 0
        behavior_age: "",
    family_history: 0,
    birth_trauma: 0,
    premature: 0,
    life_events: 0,
    focus_difficulty: 0,
    careless_mistakes: 0,
    easily_distracted: 0,
    interrupts_others: 0,
    overactive: 0,
    plays_quietly: 0,
    forgets_activities: 0,
    attention_to_details: 0,
    following_instructions: 0,
    playing_quietly: 0,
    fidgets_hands_feet: 0,
    runs_climbs_excessively: 0,
    talks_excessively: 0,
    loses_items: 0,
    avoids_sustained_mental_effort: 0,
  });

  const [prediction, setPrediction] = useState(null);
  const [predictionDetails, setPredictionDetails] = useState(null);
  const [showGame, setShowGame] = useState(false); // State to control game visibility

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Parse value to ensure it's a number
    setFormData({
      ...formData,
      [name]: value === "" ? "" : parseInt(value, 10), // Handle empty input and parse numbers
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/api/diagnose/predict", formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.headers["content-type"].includes("application/json")) {
        const result = response.data;
        setPrediction(result.prediction);
        setPredictionDetails(result);
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

  const handleNextButtonClick = () => {
    Swal.fire({
      title: "Pass the Device to the Child",
      text: "Please pass your device to the child for the cognitive activities.",
      icon: "info",
      confirmButtonText: "OK",
    }).then((result) => {
      if (result.isConfirmed) {
        setShowGame(true); // Show the game after confirmation
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-6 md:p-8">
      {!showGame ? (
        <>
          <h2 className="text-2xl font-semibold text-center">ADHD Prediction Form</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Age Input */}
            <div>
              <label className="block text-sm font-medium">What is your age?</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 border rounded-lg"
              />
            </div>

            {/* Behavior Age Input */}
            <div>
              <label className="block text-sm font-medium">At what age did you start noticing these behaviors?</label>
              <input
                type="number"
                name="behavior_age"
                value={formData.behavior_age}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg"
              />
            </div>

            {/* Grouped questions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center space-x-4">
                  <span className="text-sm">Do you have a family history of ADHD?</span>
                  <input
                    type="radio"
                    name="family_history"
                    value="Yes"
                    checked={formData.family_history === 1}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  <span>Yes</span>
                  <input
                    type="radio"
                    name="family_history"
                    value="No"
                    checked={formData.family_history === 0}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  <span>No</span>
                </label>
              </div>

              <div>
                <label className="flex items-center space-x-4">
                  <span className="text-sm">Did you experience birth trauma?</span>
                  <input
                    type="radio"
                    name="birth_trauma"
                    value="Yes"
                    checked={formData.birth_trauma === 1}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  <span>Yes</span>
                  <input
                    type="radio"
                    name="birth_trauma"
                    value="No"
                    checked={formData.birth_trauma === 0}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  <span>No</span>
                </label>
              </div>

              <div>
                <label className="flex items-center space-x-4">
                  <span className="text-sm">Were you born prematurely?</span>
                  <input
                    type="radio"
                    name="premature"
                    value="Yes"
                    checked={formData.premature === 1}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  <span>Yes</span>
                  <input
                    type="radio"
                    name="premature"
                    value="No"
                    checked={formData.premature === 0}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  <span>No</span>
                </label>
              </div>

              <div>
                <label className="flex items-center space-x-4">
                  <span className="text-sm">Have you experienced major life events?</span>
                  <input
                    type="radio"
                    name="life_events"
                    value="Yes"
                    checked={formData.life_events === 1}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  <span>Yes</span>
                  <input
                    type="radio"
                    name="life_events"
                    value="No"
                    checked={formData.life_events === 0}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  <span>No</span>
                </label>
              </div>

              <div>
                <label className="flex items-center space-x-4">
                  <span className="text-sm">Do you have difficulty focusing?</span>
                  <input
                    type="radio"
                    name="focus_difficulty"
                    value="Yes"
                    checked={formData.focus_difficulty === 1}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  <span>Yes</span>
                  <input
                    type="radio"
                    name="focus_difficulty"
                    value="No"
                    checked={formData.focus_difficulty === 0}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  <span>No</span>
                </label>
              </div>

              <div>
                <label className="flex items-center space-x-4">
                  <span className="text-sm">Do you make careless mistakes often?</span>
                  <input
                    type="radio"
                    name="careless_mistakes"
                    value="Yes"
                    checked={formData.careless_mistakes === 1}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  <span>Yes</span>
                  <input
                    type="radio"
                    name="careless_mistakes"
                    value="No"
                    checked={formData.careless_mistakes === 0}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  <span>No</span>
                </label>
              </div>

              <div>
                <label className="flex items-center space-x-4">
                  <span className="text-sm">Do you get easily distracted?</span>
                  <input
                    type="radio"
                    name="easily_distracted"
                    value="Yes"
                    checked={formData.easily_distracted === 1}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  <span>Yes</span>
                  <input
                    type="radio"
                    name="easily_distracted"
                    value="No"
                    checked={formData.easily_distracted === 0}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  <span>No</span>
                </label>
              </div>

              <div>
                <label className="flex items-center space-x-4">
                  <span className="text-sm">Do you interrupt others during conversations?</span>
                  <input
                    type="radio"
                    name="interrupts_others"
                    value="Yes"
                    checked={formData.interrupts_others === 1}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  <span>Yes</span>
                  <input
                    type="radio"
                    name="interrupts_others"
                    value="No"
                    checked={formData.interrupts_others === 0}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  <span>No</span>
                </label>
              </div>

              {/* Additional Questions */}
              <div>
                <label className="flex items-center space-x-4">
                  <span className="text-sm">Is the child overactive?</span>
                  <input
                    type="radio"
                    name="overactive"
                    value="Yes"
                    checked={formData.overactive === 1}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  <span>Yes</span>
                  <input
                    type="radio"
                    name="overactive"
                    value="No"
                    checked={formData.overactive === 0}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  <span>No</span>
                </label>
              </div>

              <div>
                <label className="flex items-center space-x-4">
                  <span className="text-sm">Plays quietly?</span>
                  <input
                    type="radio"
                    name="plays_quietly"
                    value="Yes"
                    checked={formData.plays_quietly === 1}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  <span>Yes</span>
                  <input
                    type="radio"
                    name="plays_quietly"
                    value="No"
                    checked={formData.plays_quietly === 0}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  <span>No</span>
                </label>
              </div>

              <div>
                <label className="flex items-center space-x-4">
                  <span className="text-sm">Forgets activities?</span>
                  <input
                    type="radio"
                    name="forgets_activities"
                    value="Yes"
                    checked={formData.forgets_activities === 1}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  <span>Yes</span>
                  <input
                    type="radio"
                    name="forgets_activities"
                    value="No"
                    checked={formData.forgets_activities === 0}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  <span>No</span>
                </label>
              </div>

              <div>
                <label className="flex items-center space-x-4">
                  <span className="text-sm">Attention to details?</span>
                  <input
                    type="radio"
                    name="attention_to_details"
                    value="Yes"
                    checked={formData.attention_to_details === 1}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  <span>Yes</span>
                  <input
                    type="radio"
                    name="attention_to_details"
                    value="No"
                    checked={formData.attention_to_details === 0}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  <span>No</span>
                </label>
              </div>

              <div>
                <label className="flex items-center space-x-4">
                  <span className="text-sm">Following instructions?</span>
                  <input
                    type="radio"
                    name="following_instructions"
                    value="Yes"
                    checked={formData.following_instructions === 1}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  <span>Yes</span>
                  <input
                    type="radio"
                    name="following_instructions"
                    value="No"
                    checked={formData.following_instructions === 0}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  <span>No</span>
                </label>
              </div>

              <div>
                <label className="flex items-center space-x-4">
                  <span className="text-sm">Playing quietly?</span>
                  <input
                    type="radio"
                    name="playing_quietly"
                    value="Yes"
                    checked={formData.playing_quietly === 1}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  <span>Yes</span>
                  <input
                    type="radio"
                    name="playing_quietly"
                    value="No"
                    checked={formData.playing_quietly === 0}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  <span>No</span>
                </label>
              </div>

              <div>
                <label className="flex items-center space-x-4">
                  <span className="text-sm">Fidgets hands or feet?</span>
                  <input
                    type="radio"
                    name="fidgets_hands_feet"
                    value="Yes"
                    checked={formData.fidgets_hands_feet === 1}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  <span>Yes</span>
                  <input
                    type="radio"
                    name="fidgets_hands_feet"
                    value="No"
                    checked={formData.fidgets_hands_feet === 0}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  <span>No</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </form>

          {/* Next Button to Show Game */}
          <div className="flex justify-center mt-4">
            <button
              onClick={handleNextButtonClick}
              className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <StroopTest /> // Show the StroopTest game
      )}

       {prediction !== null && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg text-center">
              <h3 className="text-lg font-semibold">Prediction Result:</h3>
              <div
                className={`mt-2 py-2 px-4 rounded-lg text-white text-lg font-bold ${prediction === "1" ? "bg-red-500" : "bg-green-500"}`}
              >
                {prediction === "1" ? "Positive for ADHD" : "Negative for ADHD"}
              </div>
              <button
                onClick={handleNextButtonClick}
                className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
              >
                Next
              </button>
            </div>
          )}
    </div>
  );
};

export default PredictionForm;
