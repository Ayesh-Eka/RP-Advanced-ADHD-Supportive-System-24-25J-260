// import React, { useState, useEffect, useRef } from "react";
// import Swal from "sweetalert2"; // Import SweetAlert2
// import { useNavigate } from "react-router-dom"; // Import useNavigate

// const shapes = [
//   { id: 1, type: "square", color: "red" },
//   { id: 2, type: "square", color: "blue" },
//   { id: 3, type: "square", color: "green" },
//   { id: 4, type: "square", color: "yellow" },
//   { id: 5, type: "square", color: "purple" },
// ];

// const colors = [
//   "red",
//   "blue",
//   "green",
//   "yellow",
//   "purple",
//   "orange",
//   "pink",
//   "brown",
//   "gray",
//   "cyan",
// ];

// const PaintingGame = () => {
//   const [currentShapeIndex, setCurrentShapeIndex] = useState(0);
//   const [selectedColor, setSelectedColor] = useState("red");
//   const [score, setScore] = useState(0);
//   const [startTime, setStartTime] = useState(Date.now());
//   const [endTime, setEndTime] = useState(null);
//   const [feedback, setFeedback] = useState(""); // Feedback for wrong/right color

//   const canvasRef = useRef(null);
//   const [isPainting, setIsPainting] = useState(false);

//   // Use the useNavigate hook
//   const navigate = useNavigate();

//   // Show SweetAlert popup when the component mounts
//   useEffect(() => {
//     Swal.fire({
//       title: "Hello champ!",
//       text: "This is the Paint Game. Click OK to start painting!",
//       icon: "info",
//       confirmButtonText: "OK",
//     }).then(() => {
//       setStartTime(Date.now()); // Start timer after the user clicks OK
//     });
//   }, []);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const context = canvas.getContext("2d");

//     // Clear the canvas and draw the blank shape
//     const drawBlankShape = () => {
//       context.clearRect(0, 0, canvas.width, canvas.height);
//       context.strokeStyle = "black";
//       context.lineWidth = 2;

//       const currentShape = shapes[currentShapeIndex];
//       switch (currentShape.type) {
//         case "square":
//           context.strokeRect(50, 50, 200, 200);
//           break;
//         case "circle":
//           context.beginPath();
//           context.arc(150, 150, 100, 0, 2 * Math.PI);
//           context.stroke();
//           break;
//         case "triangle":
//           context.beginPath();
//           context.moveTo(150, 50);
//           context.lineTo(50, 250);
//           context.lineTo(250, 250);
//           context.closePath();
//           context.stroke();
//           break;
//         case "rectangle":
//           context.strokeRect(50, 100, 200, 100);
//           break;
//         case "oval":
//           context.beginPath();
//           context.ellipse(150, 150, 120, 80, 0, 0, 2 * Math.PI);
//           context.stroke();
//           break;
//         default:
//           break;
//       }
//     };

//     drawBlankShape();
//   }, [currentShapeIndex]);

//   const startPainting = (event) => {
//     setIsPainting(true);
//     const canvas = canvasRef.current;
//     const context = canvas.getContext("2d");
//     const rect = canvas.getBoundingClientRect();
//     const x = event.clientX - rect.left;
//     const y = event.clientY - rect.top;

//     // Draw a circle at the starting point
//     context.fillStyle = selectedColor;
//     context.beginPath();
//     context.arc(x, y, 10, 0, 2 * Math.PI); // Brush size: 10px radius (reduced from 15px)
//     context.fill();
//   };

//   const paint = (event) => {
//     if (isPainting) {
//       const canvas = canvasRef.current;
//       const context = canvas.getContext("2d");
//       const rect = canvas.getBoundingClientRect();
//       const x = event.clientX - rect.left;
//       const y = event.clientY - rect.top;

//       // Draw a circle at the current position
//       context.fillStyle = selectedColor;
//       context.beginPath();
//       context.arc(x, y, 10, 0, 2 * Math.PI); // Brush size: 10px radius (reduced from 15px)
//       context.fill();
//     }
//   };

//   const stopPainting = () => {
//     if (!isPainting) return; // Ensure painting has started

//     setIsPainting(false);

//     // Check if the shape is painted correctly
//     const canvas = canvasRef.current;
//     const context = canvas.getContext("2d");
//     const currentShape = shapes[currentShapeIndex];

//     // Get the color of the center pixel of the shape
//     const centerX = 150; // Center of the canvas
//     const centerY = 150; // Center of the canvas
//     const pixel = context.getImageData(centerX, centerY, 1, 1).data;
//     const paintedColor = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;

//     // Compare the painted color with the correct color
//     if (paintedColor === `rgb(${hexToRgb(currentShape.color)})`) {
//       setScore((prevScore) => Math.min(prevScore + 20, 100)); // Add 20 points, but cap at 100
//       setFeedback("Correct! 🎉"); // Positive feedback
//     } else {
//       setFeedback("Wrong color! Try again."); // Negative feedback
//     }

//     // Move to the next shape after a short delay
//     setTimeout(() => {
//       if (currentShapeIndex < shapes.length - 1) {
//         setCurrentShapeIndex(currentShapeIndex + 1);
//         setFeedback(""); // Clear feedback
//       } else {
//         setEndTime(Date.now()); // End the game after the last shape
//       }
//     }, 1000); // 1-second delay before moving to the next shape
//   };

//   const hexToRgb = (color) => {
//     // Convert Tailwind color names to RGB values
//     const colorMap = {
//       red: "255, 0, 0",
//       blue: "0, 0, 255",
//       green: "0, 128, 0",
//       yellow: "255, 255, 0",
//       purple: "128, 0, 128",
//       orange: "255, 165, 0",
//       pink: "255, 192, 203",
//       brown: "165, 42, 42",
//       gray: "128, 128, 128",
//       cyan: "0, 255, 255",
//     };
//     return colorMap[color];
//   };

//   const handleColorSelection = (color) => {
//     setSelectedColor(color);
//   };

//   const getElapsedTime = () => {
//     if (!endTime) return 0;
//     return Math.round((endTime - startTime) / 60000); // Convert ms to minutes
//   };

//   const calculateInterestLevel = () => {
//     const finalScore = score / 100; // Scale score to 100
//     const timeSpent = Math.min(getElapsedTime(), 60) / 60; // Cap time at 60 minutes
//     const interestLevel = ((finalScore + timeSpent) / 2) * 10;
//     localStorage.setItem("nonEdu", Math.round(interestLevel));
//     return Math.round(interestLevel);
//   };

//   const currentShape = shapes[currentShapeIndex];

//   // Function to get the correct Tailwind class for a color
//   const getColorClass = (color) => {
//     switch (color) {
//       case "red":
//         return "bg-red-500";
//       case "blue":
//         return "bg-blue-500";
//       case "green":
//         return "bg-green-500";
//       case "yellow":
//         return "bg-yellow-500";
//       case "purple":
//         return "bg-purple-500";
//       case "orange":
//         return "bg-orange-500";
//       case "pink":
//         return "bg-pink-500";
//       case "brown":
//         return "bg-amber-800"; // Tailwind doesn't have brown, so using amber-800
//       case "gray":
//         return "bg-gray-500";
//       case "cyan":
//         return "bg-cyan-500";
//       default:
//         return "bg-gray-500";
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//       <div className="bg-gradient-to-r from-yellow-200 to-yellow-300 max-w-4xl w-full p-8 rounded-xl shadow-lg">
//         {endTime ? (
//           <div className="text-center">
//             <h1 className="text-3xl font-bold text-red-600 mb-4">Finish!</h1>
//             <h2 className="text-2xl text-gray-800 mb-2">Score: {score} / 100</h2>
//             <h3 className="text-xl text-gray-700 mb-4">Time Spent: {getElapsedTime()} minutes</h3>
//             <h2 className="text-2xl text-gray-800 mb-6">Interest Level: {calculateInterestLevel()}</h2>
//             <div className="flex justify-center gap-4 w-full max-w-xs mx-auto">
//               <button
//                 onClick={() => window.location.reload()}
//                 className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors flex-1"
//               >
//                 Play Again
//               </button>
//               <button
//                 onClick={() => {
//                   navigate("/taskform"); // Navigate to /taskform
//                 }}
//                 className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors flex-1"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div>
//             <div className="flex flex-col lg:flex-row gap-8">
//               {/* Example Shape */}
//               <div className="lg:w-1/2">
//                 <h3 className="text-xl text-gray-800 mb-4">Example Shape</h3>
//                 <div
//                   className={`w-40 h-40 ${getColorClass(currentShape.color)} ${
//                     currentShape.type === "circle"
//                       ? "rounded-full"
//                       : currentShape.type === "triangle"
//                       ? "clip-triangle"
//                       : currentShape.type === "oval"
//                       ? "rounded-[50%]"
//                       : "rounded-lg"
//                   }`}
//                 ></div>
//               </div>

//               {/* Canvas for Painting */}
//               <div className="lg:w-1/2">
//                 <h3 className="text-xl text-gray-800 mb-4">Paint the Shape</h3>
//                 <canvas
//                   ref={canvasRef}
//                   width={300}
//                   height={300}
//                   onMouseDown={startPainting}
//                   onMouseMove={paint}
//                   onMouseUp={stopPainting}
//                   onMouseLeave={stopPainting}
//                   className="border-2 border-gray-300 cursor-crosshair"
//                 ></canvas>
//               </div>
//             </div>

//             {/* Feedback */}
//             {feedback && (
//               <div className="text-center mt-4">
//                 <p
//                   className={`text-xl font-semibold ${
//                     feedback.includes("Correct") ? "text-green-600" : "text-red-600"
//                   }`}
//                 >
//                   {feedback}
//                 </p>
//               </div>
//             )}

//             {/* Color Palette */}
//             <div className="mt-8">
//               <h3 className="text-xl text-gray-800 mb-4">Select a Color</h3>
//               <div className="grid grid-cols-5 gap-4">
//                 {colors.map((color) => (
//                   <div
//                     key={color}
//                     onClick={() => handleColorSelection(color)}
//                     className={`w-10 h-10 ${getColorClass(color)} rounded-full cursor-pointer border-2 ${
//                       selectedColor === color ? "border-black" : "border-gray-300"
//                     }`}
//                   ></div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PaintingGame;

import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2"; // Import SweetAlert2
import { useNavigate } from "react-router-dom"; // Import useNavigate

const shapes = [
  { id: 1, type: "square", color: "red" },
  { id: 2, type: "square", color: "blue" },
  { id: 3, type: "square", color: "green" },
  { id: 4, type: "square", color: "yellow" },
  { id: 5, type: "square", color: "purple" },
];

const colors = [
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "orange",
  "pink",
  "brown",
  "gray",
  "cyan",
];

const PaintingGame = () => {
  const [currentShapeIndex, setCurrentShapeIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState("red");
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [endTime, setEndTime] = useState(null);
  const [feedback, setFeedback] = useState(""); // Feedback for wrong/right color

  const canvasRef = useRef(null);
  const [isPainting, setIsPainting] = useState(false);

  // Use the useNavigate hook
  const navigate = useNavigate();

  // Show SweetAlert popup when the component mounts
  useEffect(() => {
    Swal.fire({
      title: "Hello Friend!",
      text: "You have another interesting activity.This is the Paint Game.Colour shapes with one-click. Click OK to start painting!",
      icon: "info",
      confirmButtonText: "OK",
      confirmButtonColor: "#6EE7B7", // Soft green
      background: "linear-gradient(135deg, #A5D6A7 0%, #C5CAE9 100%)", // Light green to lavender gradient
      iconColor: "#4A90E2", // Soft blue
      color: "#2C3E50", // Dark text for contrast
    }).then(() => {
      setStartTime(Date.now()); // Start timer after the user clicks OK
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Clear the canvas and draw the blank shape
    const drawBlankShape = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.strokeStyle = "black";
      context.lineWidth = 2;

      const currentShape = shapes[currentShapeIndex];
      switch (currentShape.type) {
        case "square":
          context.strokeRect(50, 50, 200, 200);
          break;
        case "circle":
          context.beginPath();
          context.arc(150, 150, 100, 0, 2 * Math.PI);
          context.stroke();
          break;
        case "triangle":
          context.beginPath();
          context.moveTo(150, 50);
          context.lineTo(50, 250);
          context.lineTo(250, 250);
          context.closePath();
          context.stroke();
          break;
        case "rectangle":
          context.strokeRect(50, 100, 200, 100);
          break;
        case "oval":
          context.beginPath();
          context.ellipse(150, 150, 120, 80, 0, 0, 2 * Math.PI);
          context.stroke();
          break;
        default:
          break;
      }
    };

    drawBlankShape();
  }, [currentShapeIndex]);

  const startPainting = (event) => {
    setIsPainting(true);
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Draw a circle at the starting point
    context.fillStyle = selectedColor;
    context.beginPath();
    context.arc(x, y, 10, 0, 2 * Math.PI); // Brush size: 10px radius
    context.fill();
  };

  const paint = (event) => {
    if (isPainting) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Draw a circle at the current position
      context.fillStyle = selectedColor;
      context.beginPath();
      context.arc(x, y, 10, 0, 2 * Math.PI); // Brush size: 10px radius
      context.fill();
    }
  };

  const stopPainting = () => {
    if (!isPainting) return; // Ensure painting has started

    setIsPainting(false);

    // Check if the shape is painted correctly
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const currentShape = shapes[currentShapeIndex];

    // Get the color of the center pixel of the shape
    const centerX = 150; // Center of the canvas
    const centerY = 150; // Center of the canvas
    const pixel = context.getImageData(centerX, centerY, 1, 1).data;
    const paintedColor = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;

    // Compare the painted color with the correct color
    if (paintedColor === `rgb(${hexToRgb(currentShape.color)})`) {
      setScore((prevScore) => Math.min(prevScore + 20, 100)); // Add 20 points, but cap at 100
      setFeedback("Correct! 🎉"); // Positive feedback
    } else {
      setFeedback("Wrong color! Try again."); // Negative feedback
    }

    // Move to the next shape after a short delay
    setTimeout(() => {
      if (currentShapeIndex < shapes.length - 1) {
        setCurrentShapeIndex(currentShapeIndex + 1);
        setFeedback(""); // Clear feedback
      } else {
        setEndTime(Date.now()); // End the game after the last shape
      }
    }, 1000); // 1-second delay before moving to the next shape
  };

  const hexToRgb = (color) => {
    // Convert Tailwind color names to RGB values
    const colorMap = {
      red: "255, 0, 0",
      blue: "0, 0, 255",
      green: "0, 128, 0",
      yellow: "255, 255, 0",
      purple: "128, 0, 128",
      orange: "255, 165, 0",
      pink: "255, 192, 203",
      brown: "165, 42, 42",
      gray: "128, 128, 128",
      cyan: "0, 255, 255",
    };
    return colorMap[color];
  };

  const handleColorSelection = (color) => {
    setSelectedColor(color);
  };

  const getElapsedTime = () => {
    if (!endTime) return 0;
    return Math.round((endTime - startTime) / 60000); // Convert ms to minutes
  };

  const calculateInterestLevel = () => {
    const finalScore = score / 100; // Scale score to 100
    const timeSpent = Math.min(getElapsedTime(), 60) / 60; // Cap time at 60 minutes
    const interestLevel = ((finalScore + timeSpent) / 2) * 10;
    localStorage.setItem("nonEdu", Math.round(interestLevel));
    return Math.round(interestLevel);
  };

  const currentShape = shapes[currentShapeIndex];

  // Function to get the correct Tailwind class for a color
  const getColorClass = (color) => {
    switch (color) {
      case "red":
        return "bg-red-500";
      case "blue":
        return "bg-blue-500";
      case "green":
        return "bg-green-500";
      case "yellow":
        return "bg-yellow-500";
      case "purple":
        return "bg-purple-500";
      case "orange":
        return "bg-orange-500";
      case "pink":
        return "bg-pink-500";
      case "brown":
        return "bg-amber-800"; // Tailwind doesn't have brown, so using amber-800
      case "gray":
        return "bg-gray-500";
      case "cyan":
        return "bg-cyan-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-purple-200 flex items-center justify-center p-4">
      <div className="bg-gradient-to-r from-yellow-100 to-pink-100 max-w-4xl w-full p-8 rounded-2xl shadow-2xl">
        {endTime ? (
          <div className="text-center">
            <h1 className="text-4xl font-bold text-purple-800 mb-4">Finish!</h1>
            <h2 className="text-3xl text-blue-800 mb-2">Score: {score} / 100</h2>
            <h3 className="text-2xl text-green-800 mb-4">Time Spent: {getElapsedTime()} minutes</h3>
            <h2 className="text-3xl text-red-800 mb-6">Interest Level: {calculateInterestLevel()}</h2>
            <div className="flex justify-center gap-4 w-full max-w-xs mx-auto">
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors shadow-lg"
              >
                Play Again 🔄
              </button>
              <button
                onClick={() => navigate("/taskform")}
                className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors shadow-lg"
              >
                Next ➡️
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Example Shape */}
              <div className="lg:w-1/2">
                <h3 className="text-2xl text-purple-800 mb-4">Example Shape</h3>
                <div
                  className={`w-40 h-40 ${getColorClass(currentShape.color)} ${
                    currentShape.type === "circle"
                      ? "rounded-full"
                      : currentShape.type === "triangle"
                      ? "clip-triangle"
                      : currentShape.type === "oval"
                      ? "rounded-[50%]"
                      : "rounded-lg"
                  } shadow-lg`}
                ></div>
              </div>

              {/* Canvas for Painting */}
              <div className="lg:w-1/2">
                <h3 className="text-2xl text-purple-800 mb-4">Paint the Shape</h3>
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={300}
                  onMouseDown={startPainting}
                  onMouseMove={paint}
                  onMouseUp={stopPainting}
                  onMouseLeave={stopPainting}
                  className="border-2 border-purple-300 cursor-crosshair shadow-lg"
                ></canvas>
              </div>
            </div>

            {/* Feedback */}
            {feedback && (
              <div className="text-center mt-4">
                <p
                  className={`text-2xl font-semibold ${
                    feedback.includes("Correct") ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {feedback}
                </p>
              </div>
            )}

            {/* Color Palette */}
            <div className="mt-8">
              <h3 className="text-2xl text-purple-800 mb-4">Select a Color</h3>
              <div className="grid grid-cols-5 gap-4">
                {colors.map((color) => (
                  <div
                    key={color}
                    onClick={() => handleColorSelection(color)}
                    className={`w-12 h-12 ${getColorClass(color)} rounded-full cursor-pointer border-2 ${
                      selectedColor === color ? "border-black" : "border-gray-300"
                    } shadow-lg hover:scale-110 transition-transform`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaintingGame;