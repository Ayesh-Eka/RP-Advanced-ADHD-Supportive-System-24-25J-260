# import sys
# import pickle
# import numpy as np

# # Load the trained model
# with open("model.dat", "rb") as f:
#     model = pickle.load(f)

# # Get input parameters from Node.js
# category = int(sys.argv[1])
# days_to_deadline = int(sys.argv[2])
# interest_level = int(sys.argv[3])
# duration = int(sys.argv[4])
# age = int(sys.argv[5])
# gender = int(sys.argv[6])

# # Prepare input data for prediction
# input_data = np.array([[category, days_to_deadline, interest_level, duration, age, gender]])

# # Make a prediction
# prediction = model.predict(input_data)[0]

# # Return the predicted priority
# print(prediction)


import sys
import numpy as np
import pandas as pd
import pickle
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier

# Load the trained model
model = None
with open('TaskPrioritizeModel/model.dat', 'rb') as file:
    model = pickle.load(file)

# Get the input parameters from the command-line arguments
category = int(sys.argv[1])
days_to_deadline = int(sys.argv[2])
interest_level = int(sys.argv[3])
duration = int(sys.argv[4])
age = int(sys.argv[5])
gender = int(sys.argv[6])

# Create a DataFrame for the input data with column names that match the training data
input_data = pd.DataFrame([[category, days_to_deadline, interest_level, duration, age, gender]],
                          columns=['Category', 'Days to Deadline', 'Interest Level', 'Duration', 'Age', 'Gender'])

# Predict using the loaded model
predicted_value = model.predict(input_data)

# Print the predicted value (the priority)
print(f"Predicted priority: {predicted_value[0]}")

