import React from "react";
import { useNavigate } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import FinalizedReportPDF from "../components/FinalizedReportPDF"; // Component for generating PDF

const FinalizedReport = () => {
  const navigate = useNavigate();
  const storedData = JSON.parse(localStorage.getItem("userInputs")) || {};

  // Mock data for charts (replace with actual data)
  const chartData = {
    labels: ["Task 1", "Task 2", "Task 3", "Task 4", "Task 5"],
    scores: [80, 60, 90, 50, 70], // Example scores
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 p-6">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-8">
        <h1 className="text-4xl font-extrabold text-gray-800 text-center drop-shadow-md">
          Finalized Report
        </h1>

        {/* User Details */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
          <div className="mt-4 space-y-2">
            <p><strong>Name:</strong> {storedData.name || "Not provided"}</p>
            <p><strong>Age:</strong> {storedData.age || "Not provided"}</p>
            <p><strong>Behavior Started Age:</strong> {storedData.behavior_age || "Not provided"}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800">Performance Charts</h2>
          <div className="mt-4">
            {/* Example Chart (replace with actual chart library like Chart.js) */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Task Scores</h3>
              <ul className="mt-2">
                {chartData.labels.map((label, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{label}</span>
                    <span>{chartData.scores[index]}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-between">
          <button
            className="px-6 py-3 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700"
            onClick={() => navigate("/")} // Navigate back to home
          >
            OK
          </button>
          <PDFDownloadLink
            document={<FinalizedReportPDF data={storedData} chartData={chartData} />}
            fileName="finalized_report.pdf"
          >
            {({ loading }) => (
              <button
                className="px-6 py-3 bg-green-500 text-white text-lg rounded-lg hover:bg-green-600"
                disabled={loading}
              >
                {loading ? "Generating PDF..." : "Download PDF"}
              </button>
            )}
          </PDFDownloadLink>
        </div>
      </div>
    </div>
  );
};

export default FinalizedReport;