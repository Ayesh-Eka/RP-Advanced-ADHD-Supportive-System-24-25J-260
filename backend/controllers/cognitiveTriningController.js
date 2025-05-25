const axios = require("axios");

const FLASK_API_URL = "http://localhost:5001/predict"; // Flask backend URL

// Controller function to handle prediction
const getPrediction = async (req, res) => {
    try {
        console.log("Received request:", req.body); // Debugging log

        const response = await axios.post(FLASK_API_URL, req.body, {
            headers: { "Content-Type": "application/json" },
        });

        console.log("Flask response:", response.data); // Debugging log

        res.json(response.data);
    } catch (error) {
        console.error("Error making prediction:", error.message);

        if (error.response) {
            console.error("Flask response error:", error.response.data);
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: "Failed to get prediction" });
        }
    }
};

module.exports = { getPrediction };
