import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const TaskForm = () => {
  const [formData, setFormData] = useState({
    task_name: "",
    category: "1",
    deadline_date: "",
    days_to_deadline: "",
    interest_level: "",
    duration: "",
    age: "",
    gender: "1",
  });

  const [taskList, setTaskList] = useState([]);

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    const updatedFormData = { ...formData, category: selectedCategory };

    if (selectedCategory === "1") {
      updatedFormData.interest_level = localStorage.getItem("interestLevel") || "";
    }

    setFormData(updatedFormData);
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
        html: `The predicted priority for <strong>${formData.task_name}</strong> is: <br><br>
               <span class="text-2xl text-green-600">${predictedPriority}</span>`,
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#4CAF50",
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
    updatedTaskList[index].completed = !updatedTaskList[index].completed;
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
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto bg-gradient-to-r from-yellow-200 to-yellow-300 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Task Prioritization</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-2">Task Name:</label>
            <input
              type="text"
              name="task_name"
              value={formData.task_name}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-2">Category:</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1">Educational</option>
              <option value="0">Other</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-2">Deadline Date:</label>
            <input
              type="date"
              name="deadline_date"
              value={formData.deadline_date}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-2">Days to Deadline:</label>
            <input
              type="number"
              name="days_to_deadline"
              value={formData.days_to_deadline}
              readOnly
              className="p-3 border border-gray-300 rounded-lg bg-gray-100"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-2">Interest Level:</label>
            <input
              type="number"
              name="interest_level"
              value={formData.interest_level}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-2">Duration (min):</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-2">Age:</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-2">Gender:</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1">Male</option>
              <option value="2">Female</option>
            </select>
          </div>

          <button
            type="submit"
            className="col-span-full bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all"
          >
            Prioritize
          </button>
        </form>
      </div>

      {taskList.length > 0 && (
        <div className="mt-8 max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">Eisenhower Matrix</h3>
          <button
            onClick={downloadPdf}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all block mx-auto mb-6"
          >
            Download as PDF
          </button>
          <table id="eisenhower-matrix-table" className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <th className="p-4">Urgent & Important (High)</th>
                <th className="p-4">Important but Not Urgent (Medium)</th>
                <th className="p-4">Neither Urgent Nor Important (Low)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4 border-2 border-gray-200">
                  {taskList
                    .filter((task) => task.priority === "Predicted priority: High")
                    .map((task, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 mb-2 bg-red-100 rounded-lg"
                      >
                        <span
                          className={`text-gray-800 ${
                            task.completed ? "line-through" : ""
                          }`}
                        >
                          {task.taskName}
                        </span>
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTaskCompletion(index)}
                          className="w-5 h-5 accent-blue-500"
                        />
                      </div>
                    ))}
                </td>
                <td className="p-4 border-2 border-gray-200">
                  {taskList
                    .filter((task) => task.priority === "Predicted priority: Medium")
                    .map((task, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 mb-2 bg-yellow-100 rounded-lg"
                      >
                        <span
                          className={`text-gray-800 ${
                            task.completed ? "line-through" : ""
                          }`}
                        >
                          {task.taskName}
                        </span>
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTaskCompletion(index)}
                          className="w-5 h-5 accent-blue-500"
                        />
                      </div>
                    ))}
                </td>
                <td className="p-4 border-2 border-gray-200">
                  {taskList
                    .filter((task) => task.priority === "Predicted priority: Low")
                    .map((task, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 mb-2 bg-green-100 rounded-lg"
                      >
                        <span
                          className={`text-gray-800 ${
                            task.completed ? "line-through" : ""
                          }`}
                        >
                          {task.taskName}
                        </span>
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTaskCompletion(index)}
                          className="w-5 h-5 accent-blue-500"
                        />
                      </div>
                    ))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TaskForm;