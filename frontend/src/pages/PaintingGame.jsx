import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { useNavigate, useSearchParams } from "react-router-dom";

const AgeSelection = ({ onAgeSelect }) => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-purple-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-6">Select Age Group</h1>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => onAgeSelect("6-9")}
            className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg text-xl"
          >
            Age 6-9
          </button>
          <button
            onClick={() => onAgeSelect("10-12")}
            className="bg-purple-500 hover:bg-purple-600 text-white py-3 px-6 rounded-lg text-xl"
          >
            Age 10-12
          </button>
        </div>
      </div>
    </div>
  );
};

const PaintingGame1 = () => {
  const shapes = [
    { id: 1, type: "square", color: "red" },
    { id: 2, type: "square", color: "blue" },
    { id: 3, type: "square", color: "green" },
    { id: 4, type: "square", color: "yellow" },
    { id: 5, type: "square", color: "purple" },
  ];

  const colors = [
    "red", "blue", "green", "yellow", "purple",
    "orange", "pink", "brown", "gray", "cyan"
  ];

  const [currentShapeIndex, setCurrentShapeIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState("red");
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [endTime, setEndTime] = useState(null);
  const [feedback, setFeedback] = useState("");
  const canvasRef = useRef(null);
  const [isPainting, setIsPainting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    Swal.fire({
      title: "Hello Friend!",
      text: "You have another interesting activity. This is the Paint Game. Colour shapes with one-click. Click OK to start painting!",
      icon: "info",
      confirmButtonText: "OK",
      confirmButtonColor: "#6EE7B7",
      background: "linear-gradient(135deg, #A5D6A7 0%, #C5CAE9 100%)",
      iconColor: "#4A90E2",
      color: "#2C3E50",
    }).then(() => {
      setStartTime(Date.now());
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const drawBlankShape = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.strokeStyle = "black";
      context.lineWidth = 2;
      context.strokeRect(50, 50, 200, 200);
    };

    drawBlankShape();
  }, [currentShapeIndex]);

  const startPainting = (e) => {
    setIsPainting(true);
    drawCircle(e);
  };

  const drawCircle = (e) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    context.fillStyle = selectedColor;
    context.beginPath();
    context.arc(x, y, 7, 0, 2 * Math.PI);
    context.fill();
  };

  const paint = (e) => {
    if (isPainting) drawCircle(e);
  };

  const stopPainting = () => {
    if (!isPainting) return;
    setIsPainting(false);

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const currentShape = shapes[currentShapeIndex];
    const targetColor = hexToRgb(currentShape.color);
    
    const size = 5;
    const centerX = 150;
    const centerY = 150;
    let correctPixels = 0;
    const totalPixels = size * size;

    for (let x = centerX - Math.floor(size/2); x < centerX + Math.ceil(size/2); x++) {
      for (let y = centerY - Math.floor(size/2); y < centerY + Math.ceil(size/2); y++) {
        const pixel = context.getImageData(x, y, 1, 1).data;
        const paintedColor = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
        if (paintedColor === `rgb(${targetColor})`) {
          correctPixels++;
        }
      }
    }

    const accuracy = correctPixels / totalPixels;
    if (accuracy > 0.5) {
      setScore((prev) => Math.min(prev + 20, 100));
      setFeedback("Correct! 🎉");
    } else {
      setFeedback("Try to cover more of the area with the correct color.");
    }

    setTimeout(() => {
      if (currentShapeIndex < shapes.length - 1) {
        setCurrentShapeIndex(currentShapeIndex + 1);
        setFeedback("");
      } else {
        setEndTime(Date.now());
      }
    }, 1000);
  };

  const hexToRgb = (color) => {
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

  const getElapsedTime = () => (!endTime ? 0 : Math.round((endTime - startTime) / 60000));

  const calculateInterestLevel = () => {
    const finalScore = score / 100;
    const timeSpent = Math.min(getElapsedTime(), 60) / 60;
    const interestLevel = ((finalScore + timeSpent) / 2) * 10;
    localStorage.setItem("nonEdu", Math.round(interestLevel));
    return Math.round(interestLevel);
  };

  const getColorClass = (color) => {
    const map = {
      red: "bg-red-500",
      blue: "bg-blue-500",
      green: "bg-green-500",
      yellow: "bg-yellow-500",
      purple: "bg-purple-500",
      orange: "bg-orange-500",
      pink: "bg-pink-500",
      brown: "bg-amber-800",
      gray: "bg-gray-500",
      cyan: "bg-cyan-500",
    };
    return map[color] || "bg-gray-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-purple-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-3xl">
        {endTime ? (
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Finish!</h1>
            <h2 className="text-2xl mb-2">Score: {score} / 100</h2>
            <h3 className="text-xl mb-4">Time Spent: {getElapsedTime()} minutes</h3>
            <h2 className="text-2xl text-red-700 mb-6">Interest Level: {calculateInterestLevel()}</h2>
            <div className="flex justify-center gap-4">
              <button onClick={() => window.location.reload()} className="bg-blue-500 text-white px-4 py-2 rounded">
                Play Again 🔄
              </button>
              <button onClick={() => navigate("/taskform")} className="bg-green-500 text-white px-4 py-2 rounded">
                Next ➡️
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/2">
              <h3 className="text-xl font-semibold mb-2">Example Shape</h3>
              <div className={`w-40 h-40 ${getColorClass(shapes[currentShapeIndex].color)}`}></div>
            </div>
            <div className="lg:w-1/2">
              <h3 className="text-xl font-semibold mb-2">Paint Here</h3>
              <canvas
                ref={canvasRef}
                width={300}
                height={300}
                onMouseDown={startPainting}
                onMouseMove={paint}
                onMouseUp={stopPainting}
                onMouseLeave={stopPainting}
                className="border border-black bg-white"
              ></canvas>
              {feedback && <p className="mt-2 text-lg text-center">{feedback}</p>}
              <div className="mt-4 flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full ${getColorClass(color)} border-2 ${selectedColor === color ? "border-black" : "border-transparent"}`}
                    onClick={() => setSelectedColor(color)}
                  ></button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const PaintingGame2 = () => {
  const animals = [
    {
      id: 1,
      name: "Lion",
      coloredImage: "src/images/1.jpg",
      outlineImage: "src/images/2.jpg",
      colors: ["white", "brown", "yellow"]
    },
    {
      id: 2,
      name: "Elephant",
      coloredImage: "src/images/3.jpg",
      outlineImage: "src/images/4.jpg",
      colors: ["gray", "lightgray", "black","white","pink"]
    },
    {
      id: 3,
      name: "Parrot",
      coloredImage: "src/images/6.jpg",
      outlineImage: "src/images/5.jpg",
      colors: ["green", "red", "yellow"]
    },
    {
      id: 4,
      name: "Fish",
      coloredImage: "src/images/7.jpg",
      outlineImage: "src/images/8.jpg",
      colors: ["yellow", "orange"]
    },
    {
      id: 5,
      name: "Butterfly",
      coloredImage: "src/images/9.jpg",
      outlineImage: "src/images/10.jpg",
      colors: ["purple", "yellow", "pink"]
    }
  ];

  const colors = [
    "red", "blue", "green", "yellow", "purple",
    "orange", "pink", "brown", "gray", "black",
    "white", "lightblue", "lightgreen"
  ];

  const [currentAnimalIndex, setCurrentAnimalIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState("red");
  const [brushSize, setBrushSize] = useState(15);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [hasColored, setHasColored] = useState(false);
  const canvasRef = useRef(null);
  const [isPainting, setIsPainting] = useState(false);
  const navigate = useNavigate();

  const currentAnimal = animals[currentAnimalIndex];

  useEffect(() => {
    Swal.fire({
      title: "Hello!",
      html: `<p>Color the animal to match the example!</p>
            <p>Use different colors for different parts.</p>`,
      confirmButtonText: "OK",
      confirmButtonColor: "#6EE7B7",
      background: "#f0f9ff",
    }).then(() => {
      setStartTime(Date.now());
      loadOutlineImage();
    });
  }, []);

  useEffect(() => {
    if (startTime) {
      loadOutlineImage();
      setHasColored(false);
    }
  }, [currentAnimalIndex]);

  const loadOutlineImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.src = currentAnimal.outlineImage;
    img.crossOrigin = "Anonymous";
    
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    
    img.onerror = () => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#000000";
      ctx.font = "20px Arial";
      ctx.fillText(`${currentAnimal.name} Outline`, 50, 100);
    };
  };

  const startPainting = (e) => {
    setIsPainting(true);
    paint(e);
  };

  const paint = (e) => {
    if (!isPainting) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = selectedColor;
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.fill();
    
    if (!hasColored) {
      setHasColored(true);
    }
  };

  const stopPainting = () => {
    setIsPainting(false);
  };

  const checkPainting = () => {
    if (!hasColored) {
      setFeedback("Please color the animal first!");
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let coloredPixelCount = 0;
    let correctColorPixelCount = 0;
    const usedColors = new Set();
    
    for (let i = 0; i < imageData.length; i += 4) {
      const r = imageData[i];
      const g = imageData[i + 1];
      const b = imageData[i + 2];
      
      if (r !== 255 || g !== 255 || b !== 255) {
        coloredPixelCount++;
        const color = rgbToColorName(r, g, b);
        if (color) {
          usedColors.add(color);
          if (currentAnimal.colors.includes(color)) {
            correctColorPixelCount++;
          }
        }
      }
    }
    
    const totalPixels = canvas.width * canvas.height;
    const coverage = coloredPixelCount / totalPixels;
    const colorAccuracy = coloredPixelCount > 0 
      ? correctColorPixelCount / coloredPixelCount 
      : 0;
    
    let pointsEarned = 0;
    
    if (coverage > 0.5 && colorAccuracy > 0.5) {
      pointsEarned = 20;
      setFeedback("Perfect! You colored the entire animal with correct colors! 🎉");
    } 
    else {
      pointsEarned = 0;
      setFeedback("Keep going! Try to color more of the animal with the expected colors.");
    }
    
    if (currentAnimal.colors.every(color => usedColors.has(color))) {
      pointsEarned = Math.min(pointsEarned + 5, 20);
      setFeedback(prev => prev + " Great job using all expected colors!");
    }
    
    setScore(prev => prev + pointsEarned);
    
    setTimeout(() => {
      if (currentAnimalIndex < animals.length - 1) {
        setCurrentAnimalIndex(prev => prev + 1);
        setFeedback("");
      } else {
        setEndTime(Date.now());
      }
    }, 2000);
  };

  const rgbToColorName = (r, g, b) => {
    const colorMap = {
      "255,0,0": "red",
      "0,0,255": "blue",
      "0,128,0": "green",
      "255,255,0": "yellow",
      "128,0,128": "purple",
      "255,165,0": "orange",
      "255,192,203": "pink",
      "165,42,42": "brown",
      "128,128,128": "gray",
      "0,0,0": "black",
      "255,255,255": "white",
      "173,216,230": "lightblue",
      "144,238,144": "lightgreen"
    };
    return colorMap[`${r},${g},${b}`];
  };

  const clearCanvas = () => {
    loadOutlineImage();
    setHasColored(false);
  };

  const getColorClass = (color) => {
    const map = {
      red: "bg-red-500",
      blue: "bg-blue-500",
      green: "bg-green-500",
      yellow: "bg-yellow-400",
      purple: "bg-purple-500",
      orange: "bg-orange-500",
      pink: "bg-pink-400",
      brown: "bg-amber-800",
      gray: "bg-gray-500",
      black: "bg-black",
      white: "bg-white border border-gray-300",
      lightblue: "bg-blue-300",
      lightgreen: "bg-green-300"
    };
    return map[color] || "bg-gray-300";
  };

  const getElapsedTime = () => {
    if (!endTime || !startTime) return 0;
    return Math.round((endTime - startTime) / 60000);
  };

  const calculateInterestLevel = () => {
    if (!startTime || !endTime || !hasColored) return 0;

    const finalScore = score / 100;
    const timeSpent = Math.min(getElapsedTime(), 60) / 60;
    const interestLevel = ((finalScore + timeSpent) / 2) * 10;
    const rounded = Math.max(Math.round(interestLevel));
    localStorage.setItem("nonEdu", rounded);
    return rounded;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {endTime ? (
          <div className="p-8 text-center">
            <h1 className="text-3xl font-bold text-purple-800 mb-4">Finish!</h1>
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <p className="text-2xl mb-2">Your Score: <span className="font-bold">{hasColored ? `${score}/100` : "0/100"}</span></p>
              <p className="text-xl">Interest Level: <span className="font-bold">{calculateInterestLevel()}</span></p>
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
              >
                Play Again 🔄
              </button>
              <button
                onClick={() => navigate("/taskform")}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
              >
                Next ➡️
              </button>
            </div>
          </div>
        ) : (
          <div className="md:flex">
            <div className="md:w-1/2 p-6 border-r border-gray-200">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-xl font-bold text-center mb-4">
                  Color This {currentAnimal.name}
                </h2>
                <div className="flex justify-center mb-4">
                  <div className="w-64 h-64 rounded-lg overflow-hidden border border-gray-300">
                    <img 
                      src={currentAnimal.coloredImage} 
                      alt={`Colored ${currentAnimal.name}`}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22256%22%20height%3D%22256%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20256%20256%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18d9b5a6e6a%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A13pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18d9b5a6e6a%22%3E%3Crect%20width%3D%22256%22%20height%3D%22256%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.234375%22%20y%3D%22136.1%22%3EColored%20${currentAnimal.name}%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"
                      }}
                    />
                  </div>
                </div>
                
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800 py-2 rounded-lg"
                >
                  {showHint ? "Hide Colors" : "Show Expected Colors"}
                </button>
                
                {showHint && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                    <h3 className="font-semibold mb-2">Use these colors:</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentAnimal.colors.map(color => (
                        <div key={color} className="flex items-center">
                          <div className={`w-6 h-6 rounded-full mr-2 ${getColorClass(color)}`}></div>
                          <span className="capitalize">{color}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="md:w-1/2 p-6">
              <h2 className="text-xl font-bold text-center mb-4">
                Your Painting
              </h2>
              
              <div className="flex justify-center mb-4">
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={300}
                  onMouseDown={startPainting}
                  onMouseMove={paint}
                  onMouseUp={stopPainting}
                  onMouseLeave={stopPainting}
                  className="border border-gray-300 rounded-lg bg-white cursor-crosshair"
                />
              </div>
              
              {feedback && (
                <div className={`p-3 mb-4 text-center rounded-lg ${
                  feedback.includes("Perfect") ? "bg-green-100 text-green-800" :
                  feedback.includes("Good job") ? "bg-blue-100 text-blue-800" :
                  feedback.includes("Nice try") ? "bg-yellow-100 text-yellow-800" :
                  "bg-red-100 text-red-800"
                }`}>
                  {feedback}
                </div>
              )}

              <div className="mb-4">
                <label className="block mb-2">Brush Size: {brushSize}px</label>
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="mb-6">
                <label className="block mb-2">Colors:</label>
                <div className="flex flex-wrap gap-2">
                  {colors.map(color => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full ${getColorClass(color)} border-2 ${
                        selectedColor === color ? "border-black scale-110" : "border-transparent"
                      } transition-transform`}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={clearCanvas}
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
                >
                  Clear Canvas
                </button>
                <button
                  onClick={checkPainting}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg"
                >
                  Check
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const PaintingGame = () => {
  const [searchParams] = useSearchParams();
  const ageGroup = searchParams.get("ageGroup") || localStorage.getItem("ageGroup") || "";
  const [localAgeGroup, setLocalAgeGroup] = useState(ageGroup);
  
  if (!localAgeGroup) {
    return <AgeSelection onAgeSelect={setLocalAgeGroup} />;
  }
  
  return localAgeGroup === "6-9" ? <PaintingGame1 /> : <PaintingGame2 />;
};

export default PaintingGame;