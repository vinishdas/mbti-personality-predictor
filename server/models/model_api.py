import pandas as pd
import torch
from transformers import BertTokenizer, BertForSequenceClassification
import sys
import json

# Load the label encoder and model/tokenizer
# Ensure these files are saved in the same directory or update paths accordingly
model_path = './fine-tuned-model'  # Adjust to your model's path
label_encoder_path = './label_encoder.pkl'  # Save the label encoder as a pickle file

# Load the label encoder (assumes it's saved as a pickle file)
import pickle
with open(label_encoder_path, 'rb') as f:
    label_encoder = pickle.load(f)

# Load the fine-tuned model and tokenizer
model = BertForSequenceClassification.from_pretrained(model_path)
tokenizer = BertTokenizer.from_pretrained(model_path)

# Set the model to evaluation mode
model.eval()

# Function to predict MBTI type from user input
def predict_mbti_type(text):
    # Tokenize the input text
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=512)

    # Move input tensors to the same device as the model (CPU or GPU)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    inputs = {key: val.to(device) for key, val in inputs.items()}

    # Predict
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits

    # Get predicted class
    predicted_class = torch.argmax(logits, dim=-1).item()
    return predicted_class

# Function to convert numerical class back to MBTI type
def get_mbti_type(predicted_class):
    return label_encoder.classes_[predicted_class]

# Main script execution
if __name__ == "__main__":
    # Accept input text as a command-line argument
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No input text provided"}))
        sys.exit(1)

    input_text = sys.argv[1]

    # Perform prediction
    try:
        predicted_class = predict_mbti_type(input_text)
        mbti_type = get_mbti_type(predicted_class)
        print(json.dumps({"mbti_type": mbti_type}))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
