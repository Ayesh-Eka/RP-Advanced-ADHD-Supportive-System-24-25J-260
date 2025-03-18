import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PredictionForm = () => {
  // State to manage form data
  const [formData, setFormData] = useState({
    age: "",
    behavior_age: "",
    family_history: 0,
    birth_trauma: 0,
    premature: 0,
    life_events: 0,
    careless_mistakes: 0,
    interrupts_others: 0,
    overactive: 0,
    plays_quietly: 0,
    attention_to_details: 0,
    forgets_activities: 0,
    playing_quietly: 0,
    fidgets_hands_feet: 0,
    runs_climbs_excessively: 0,
    talks_excessively: 0,
    loses_items: 0,
    avoids_sustained_mental_effort: 0,
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value === "1" ? 1 : 0, // Convert "Yes" to 1 and "No" to 0
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert age and behavior_age to integers
    const updatedFormData = {
      ...formData,
      age: parseInt(formData.age, 10),
      behavior_age: parseInt(formData.behavior_age, 10),
    };

    // Save form data to local storage
    localStorage.setItem("userInputs", JSON.stringify(updatedFormData));
    console.log("Form data saved to local storage:", updatedFormData);
  };

  const navigate = useNavigate();

  // Handle "Next" button click
  const handleNextButtonClick = () => {
    navigate("/stroop");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, #6EE7B7, #3B82F6)",
      }}
    >
      <div
        className="max-w-2xl w-full rounded-xl shadow-lg p-6"
        style={{
          background: "linear-gradient(135deg, #FDE68A, #FCA5A5)",
        }}
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          ADHD Diesease Detection Form
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Age Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              What is the child's age?
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Behavior Age Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              At what age did you start noticing these behaviors?
            </label>
            <input
              type="number"
              name="behavior_age"
              value={formData.behavior_age}
              onChange={(e) =>
                setFormData({ ...formData, behavior_age: e.target.value })
              }
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Grouped questions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Family History */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
              Does the child has a family history of ADHD?
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="family_history"
                    value="1"
                    checked={formData.family_history === 1}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="family_history"
                    value="0"
                    checked={formData.family_history === 0}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">No</span>
                </label>
              </div>
            </div>

            {/* Birth Trauma */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
              Does the child experience birth trauma?
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="birth_trauma"
                    value="1"
                    checked={formData.birth_trauma === 1}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="birth_trauma"
                    value="0"
                    checked={formData.birth_trauma === 0}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">No</span>
                </label>
              </div>
            </div>

            {/* Premature */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
              Does the child born prematurely?
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="premature"
                    value="1"
                    checked={formData.premature === 1}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="premature"
                    value="0"
                    checked={formData.premature === 0}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">No</span>
                </label>
              </div>
            </div>

            {/* Life Events */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
              Does the child experienced major life events?
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="life_events"
                    value="1"
                    checked={formData.life_events === 1}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="life_events"
                    value="0"
                    checked={formData.life_events === 0}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">No</span>
                </label>
              </div>
            </div>

            {/* Careless Mistakes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
              Does the child make careless mistakes often?
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="careless_mistakes"
                    value="1"
                    checked={formData.careless_mistakes === 1}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="careless_mistakes"
                    value="0"
                    checked={formData.careless_mistakes === 0}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">No</span>
                </label>
              </div>
            </div>

            {/* Attention to Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
              Does the child pays attention to details?
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="attention_to_details"
                    value="1"
                    checked={formData.attention_to_details === 1}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="attention_to_details"
                    value="0"
                    checked={formData.attention_to_details === 0}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">No</span>
                </label>
              </div>
            </div>

            {/* Interrupts Others */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
              Does the child Interrupts others during conversations?
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="interrupts_others"
                    value="1"
                    checked={formData.interrupts_others === 1}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="interrupts_others"
                    value="0"
                    checked={formData.interrupts_others === 0}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">No</span>
                </label>
              </div>
            </div>

            {/* Overactive */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Is the child overactive?
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="overactive"
                    value="1"
                    checked={formData.overactive === 1}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="overactive"
                    value="0"
                    checked={formData.overactive === 0}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">No</span>
                </label>
              </div>
            </div>

            {/* Plays Quietly */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
              Does the child make friends?
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="plays_quietly"
                    value="1"
                    checked={formData.plays_quietly === 1}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="plays_quietly"
                    value="0"
                    checked={formData.plays_quietly === 0}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">No</span>
                </label>
              </div>
            </div>

            {/* Forgets Activities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
              Does the child Forgets activities?
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="forgets_activities"
                    value="1"
                    checked={formData.forgets_activities === 1}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="forgets_activities"
                    value="0"
                    checked={formData.forgets_activities === 0}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">No</span>
                </label>
              </div>
            </div>

            {/* Playing Quietly */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Does the child Playing quietly?
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="playing_quietly"
                    value="1"
                    checked={formData.playing_quietly === 1}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="playing_quietly"
                    value="0"
                    checked={formData.playing_quietly === 0}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">No</span>
                </label>
              </div>
            </div>

            {/* Fidgets Hands or Feet */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
              Does the child fidgets hands or feet?
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="fidgets_hands_feet"
                    value="1"
                    checked={formData.fidgets_hands_feet === 1}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="fidgets_hands_feet"
                    value="0"
                    checked={formData.fidgets_hands_feet === 0}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">No</span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              onClick={handleNextButtonClick}
              className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Submit & Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PredictionForm;