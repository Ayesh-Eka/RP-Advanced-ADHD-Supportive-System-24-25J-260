import sys
import pickle

# Load the trained model (make sure it's in the correct path)
with open('social-skills-model/nlp_model.dat', 'rb') as f:
    model = pickle.load(f)

# Read the input text from the command-line argument
text = sys.argv[1]

# Prediction function
def predict(text):
    return model.predict([text])[0]  # Return the first prediction (since it's a single input)

# Output the result
prediction = predict(text)
print(prediction)  # Print the result to stdout for Node.js to capture
