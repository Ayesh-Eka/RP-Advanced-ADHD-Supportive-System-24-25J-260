import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { motion, AnimatePresence } from "framer-motion"; // Import framer-motion


const TaskForm = () => {
  const [formData, setFormData] = useState({
    task_name: "",
    category: "", //enter 1
    deadline_date: "",
    days_to_deadline: "",
    interest_level: "",
    duration: "",
    age: "",
    gender: "",
  });

  const [taskList, setTaskList] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0); // Wallet balance state
  const [pointsAnimation, setPointsAnimation] = useState(null); // Points animation state

  // Initialize the interest level based on the default category when component mounts
  useEffect(() => {
    console.log('edu', localStorage.getItem("edu"));
    console.log('non', localStorage.getItem("nonEdu"));
    if (formData.category === "1") { // Educational
      setFormData(prevData => ({
        ...prevData,
        interest_level: localStorage.getItem("edu") || ""
      }));
    } else if (formData.category === "0") { // Other
      setFormData(prevData => ({
        ...prevData,
        interest_level: localStorage.getItem("nonEdu") || ""
      }));
    }
  }, []);

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    let interestLevel = "";

    if (selectedCategory === "1") { // Educational
      interestLevel = localStorage.getItem("edu") || "";
    } else if (selectedCategory === "0") { // Other
      interestLevel = localStorage.getItem("nonEdu") || "";
    }

    setFormData(prevData => ({
      ...prevData,
      category: selectedCategory,
      interest_level: interestLevel
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "deadline_date") {
      const selectedDate = new Date(value);
      const today = new Date();
      const timeDifference = selectedDate.getTime() - today.getTime();
      const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

      setFormData((prevData) => ({
        ...prevData,
        deadline_date: value,
        days_to_deadline: daysDifference >= 0 ? daysDifference : 0,
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/task-prioritize/priority", formData);
      const predictedPriority = response.data.priority;

      Swal.fire({
        title: "Task Prioritized to Eisenhower matrix!",
        html: `The predicted priority for <strong>${formData.task_name}</strong> - <br><br>
               <span class="text-2xl text-green-600">${predictedPriority}</span>`,
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#4CAF50",
        background: "linear-gradient(135deg, #A5D6A7 0%, #C5CAE9 100%)", // Light green to lavender gradient
        iconColor: "#4A90E2", // Soft blue
        color: "#2C3E50", // Dark text for contrast
      });

      const newTask = {
        taskName: formData.task_name,
        priority: predictedPriority,
        completed: false,
      };

      setTaskList((prevList) => [...prevList, newTask]);
    } catch (error) {
      console.error("Error predicting priority:", error);

      Swal.fire({
        title: "Error!",
        text: "Failed to predict priority. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#FF0000",
      });
    }
  };

  const toggleTaskCompletion = (index) => {
    const updatedTaskList = [...taskList];
    const task = updatedTaskList[index];

    if (!task.completed) {
      // Add points to wallet and trigger animation
      const points = 10; // Points to add for each task
      setWalletBalance((prevBalance) => prevBalance + points);

      // Trigger points animation
      setPointsAnimation(`+${points}`);
      setTimeout(() => setPointsAnimation(null), 2000); // Clear animation after 2 seconds
    }

    task.completed = !task.completed;
    setTaskList(updatedTaskList);
  };

  const downloadPdf = () => {
    const input = document.getElementById("eisenhower-matrix-table");

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape");
      const imgWidth = 280;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save("Eisenhower_Matrix.pdf");
    });
  };

  return (
    <div className="p-6 bg-gradient-to-r from-blue-100 to-purple-100 min-h-screen">
      <div className="max-w-3xl mx-auto bg-gradient-to-r from-yellow-200 to-pink-200 p-8 rounded-2xl shadow-2xl">
        <h2 className="text-4xl font-bold text-center text-purple-800 mb-6">Task Prioritization 🎯</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="text-purple-700 font-semibold mb-2">Task Name:</label>
            <input
              type="text"
              name="task_name"
              value={formData.task_name}
              onChange={handleChange}
              className="p-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-purple-700 font-semibold mb-2">Category:</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleCategoryChange}
              className="p-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select Category</option>
              <option value="1">Structured Tasks(Educational)</option>
              <option value="0">Relaxing Tasks(Non-Educational)</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-purple-700 font-semibold mb-2">Deadline Date:</label>
            <input
              type="date"
              name="deadline_date"
              value={formData.deadline_date}
              onChange={handleChange}
              className="p-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-purple-700 font-semibold mb-2">Days to Deadline:</label>
            <input
              type="number"
              name="days_to_deadline"
              value={formData.days_to_deadline}
              readOnly
              className="p-3 border-2 border-purple-300 rounded-lg bg-purple-100"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-purple-700 font-semibold mb-2">Interest Level:</label>
            <input
              type="number"
              name="interest_level"
              value={formData.interest_level}
              onChange={handleChange}
              className="p-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-purple-700 font-semibold mb-2">Duration (min):</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="p-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-purple-700 font-semibold mb-2">Age:</label>
            <input
              type="number"
              name="age"
              min="6"
              max="12"
              value={formData.age}
              onChange={handleChange}
              className="p-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-purple-700 font-semibold mb-2">Gender:</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="p-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="" >Select Gender</option>
              <option value="1">Male</option>
              <option value="2">Female</option>
            </select>
          </div>

          <button
            type="submit"
            className="col-span-full  text-white p-4 rounded-full font-semibold  transition-all shadow-lg bg-purple-500 hover:bg-purple-600" 
          >
            Prioritize
          </button>
        </form>
      </div>



      {taskList.length > 0 && (
  <div className="mt-8 max-w-5xl mx-auto bg-gradient-to-r from-yellow-100 to-pink-100 p-6 rounded-2xl shadow-2xl">
    <h3 className="text-3xl font-bold text-center text-purple-800 mb-6">Eisenhower Chart 📊</h3>

    <button
      onClick={downloadPdf}
      className="bg-gradient-to-r from-green-500 to-cyan-500 text-white p-3 rounded-full font-semibold hover:from-green-600 hover:to-cyan-600 transition-all shadow-lg block mx-auto mb-6"
    >
      Download as PDF 📄
    </button>

    {/* Matrix Layout */}
    <div className="relative w-full h-auto min-h-[500px]" id="eisenhower-matrix-table">
{/* Vertical line - only top half */}
<div className="absolute top-0 left-1/2 h-1/2 w-0.5 bg-purple-500 z-0"></div>

{/* Horizontal line - full width */}
<div className="absolute top-1/2 left-0 right-0 h-0.5 bg-purple-500 z-0"></div>


      {/* High Priority - Top Left */}
      <div className="absolute top-0 left-0 w-1/2 h-1/2 p-4 z-10">
        <h4 className="text-xl font-bold text-center text-red-600 mb-2">Urgent & Important | High</h4>
        {taskList
          .filter((task) => task.priority === "Predicted priority: High")
          .map((task, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-2 mb-2 bg-red-100 rounded-md"
            >
              <span className={`text-purple-800 ${task.completed ? "line-through" : ""}`}>
                {task.taskName}
              </span>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTaskCompletion(index)}
                className="w-5 h-5 accent-purple-500"
              />
            </div>
          ))}
      </div>

      {/* Medium Priority - Top Right */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 p-4 z-10">
        <h4 className="text-xl font-bold text-center text-yellow-600 mb-2">Important but Not Urgent | Medium</h4>
        {taskList
          .filter((task) => task.priority === "Predicted priority: Medium")
          .map((task, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-2 mb-2 bg-yellow-100 rounded-md"
            >
              <span className={`text-purple-800 ${task.completed ? "line-through" : ""}`}>
                {task.taskName}
              </span>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTaskCompletion(index)}
                className="w-5 h-5 accent-purple-500"
              />
            </div>
          ))}
      </div>

      {/* Low Priority - Bottom Center */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 p-4 z-10">
        <h4 className="text-xl font-bold text-center text-green-600 mb-2">Neither Urgent Nor Important | Low</h4>
        <div className="w-3/4 mx-auto">
          {taskList
            .filter((task) => task.priority === "Predicted priority: Low")
            .map((task, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 mb-2 bg-green-100 rounded-md"
              >
                <span className={`text-purple-800 ${task.completed ? "line-through" : ""}`}>
                  {task.taskName}
                </span>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompletion(index)}
                  className="w-5 h-5 accent-purple-500"
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  </div>
)}


      {/* Wallet Balance */}
      <div className="fixed bottom-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-2xl shadow-lg">
        <h3 className="text-xl font-bold text-white">Points for complete tasks: {walletBalance} </h3>
      </div>

      {/* Points Animation */}
      <AnimatePresence>
        {pointsAnimation && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 flex items-center justify-center"
          >
            <div className="bg-green-500 text-white text-6xl font-bold p-8 rounded-full shadow-lg">
              {pointsAnimation}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskForm;