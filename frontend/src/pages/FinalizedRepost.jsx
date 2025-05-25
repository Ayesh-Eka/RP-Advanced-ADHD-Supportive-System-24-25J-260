import React from "react";
import { useNavigate } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import FinalizedReportPDF from "../components/FinalizedReportPDF";

const FinalizedReport = () => {
  const navigate = useNavigate();
  const storedData = JSON.parse(localStorage.getItem("userInputs")) || {};
  const storedResult = localStorage.getItem("result"); // get result separately from localStorage
  const result = storedResult !== null ? Number(storedResult) : null; // convert to number or null

  const {
    stroop_score,
    digit_span_score,
    following_instructions_score,
    // remove result from destructure here so it's not duplicated
    ...personalDetails
  } = storedData;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 p-6">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-8">
        <h1 className="text-4xl font-extrabold text-gray-800 text-center drop-shadow-md">
          Finalized Report
        </h1>

            {/* Personal Details */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800">Personal Details</h2>
        <div className="mt-4 space-y-2">
          {Object.entries(personalDetails).map(([key, value]) => {
            // Convert to boolean, then to "Yes"/"No"
            const yesNo = value ? "Yes" : "No";
            return (
              <p key={key}>
                <strong>{key.replace(/_/g, " ")}:</strong> {yesNo}
              </p>
            );
          })}
        </div>
      </div>


        {/* Practical Test Scores */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800">Practical Test Scores</h2>
          <ul className="mt-4 space-y-2">
            <li>
              <strong>Following Instructions Score:</strong>{" "}
              {following_instructions_score || "N/A"}%
            </li>
            <li>
              <strong>Digit Span Score:</strong> {digit_span_score || "N/A"}
            </li>
            <li>
              <strong>Stroop Score:</strong> {stroop_score || "N/A"}
            </li>
          </ul>
        </div>

        {/* Prediction Result */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800">Prediction Result</h2>
          <p className="mt-4 text-lg">
            {result === 1
              ? "There is a possibility of ADHD."
              : result === 0
              ? "ADHD is less likely."
              : "Result not available."}
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-10 flex justify-between">
          <button
            className="px-6 py-3 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700"
            onClick={() => navigate("/")}
          >
            OK
          </button>
          <PDFDownloadLink
            document={
              <FinalizedReportPDF
                personalDetails={personalDetails}
                practicalScores={{
                  following_instructions_score,
                  digit_span_score,
                  stroop_score,
                }}
                result={result}
              />
            }
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
