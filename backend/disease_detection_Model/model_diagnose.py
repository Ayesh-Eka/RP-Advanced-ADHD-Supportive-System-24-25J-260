import sys
import pickle
import pandas as pd

# Load the trained model
with open("disease_detection_Model/model.dat", "rb") as file:
    model = pickle.load(file)

# Get the input parameters from Node.js
params = [int(arg) for arg in sys.argv[1:]]

# Ensure correct input format
column_names = [
    "Age", "Family_History", "Birth_Trauma", "Premature", "Behavior_Age",
    "Life_Events", "Focus_Difficulty", "Careless_Mistakes", "Easily_Distracted",
    "Interrupts_Others", "Overactive", "Plays_Quietly", "Forgets_Activities",
    "Attention_To_Details", "Following_Instructions", "Playing_Quietly",
    "Fidgets_Hands_Feet", "Runs_Climbs_Excessively", "Talks_Excessively",
    "Loses_Items", "Avoids_Sustained_Mental_Effort"
]

input_data = pd.DataFrame([params], columns=column_names)

# Make prediction
predicted_value = model.predict(input_data)

# Output prediction to Node.js
print(predicted_value[0])
