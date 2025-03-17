from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)

# Allow CORS for both frontend (React) and Node.js proxy
CORS(app, origins=["http://localhost:3000", "http://localhost:5000"])

# Load the trained model and scaler
model = joblib.load("adhd_model1.pkl")  # Ensure the correct model file
scaler = joblib.load("scaler.pkl")  # Load the scaler

# ADHD Levels based on dataset
adhd_levels = ["Combined Deficits", "High Impulsivity","Low Attention", "None"]

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        print("Received Data:", data)  # Debugging line

        # Validate required keys
        required_keys = ["Age", "Gender", "Omission", "Commission", "RT"]
        for key in required_keys:
            if key not in data:
                return jsonify({"error": f"Missing key: {key}"}), 400

        # Convert gender to numerical value
        gender_map = {"Male": 0, "Female": 1}
        gender_value = gender_map.get(data["Gender"], -1)

        if gender_value == -1:
            return jsonify({"error": "Invalid gender"}), 400

        # Convert input into the required format
        input_features = np.array([[int(data["Age"]), gender_value, 
                                    int(data["Omission"]), int(data["Commission"]), 
                                    float(data["RT"])]])
        
        # Apply the same scaling used during training
        input_features_scaled = scaler.transform(input_features)

        # Predict ADHD level
        prediction = model.predict(input_features_scaled)[0]  # Numeric output

        # Map prediction to ADHD Level
        predicted_level = adhd_levels[int(prediction)] if 0 <= int(prediction) < len(adhd_levels) else "Unknown"

        return jsonify({"ADHD Level": predicted_level})

    except Exception as e:
        print("Error:", str(e))  # Debugging log
        return jsonify({"error": "Failed to get prediction", "details": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Running on port 5001
