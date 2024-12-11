import os
import pickle
import librosa
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from io import BytesIO

app = Flask(__name__)

# Enable CORS for the Flask app
CORS(app)

# Path to the pre-trained SVM model (ensure this is the correct path)
model_path = "./svm_model.pkl"

# Function to extract Mel spectrogram features from .wav file
def extractMelSpectrogram_features(file_bytes):
    hop_length = 512
    n_fft = 2048
    n_mels = 128

    # Use librosa to load audio from bytes (in-memory)
    signal, rate = librosa.load(BytesIO(file_bytes), sr=None)  # sr=None to preserve original sample rate

    # Compute the Mel spectrogram
    S = librosa.feature.melspectrogram(y=signal, sr=rate, n_fft=n_fft, hop_length=hop_length, n_mels=n_mels)

    # Convert the Mel spectrogram to decibel (dB) scale
    S_DB = librosa.power_to_db(S, ref=np.max)

    # Flatten and truncate to a fixed length (1200 in this case)
    S_DB = S_DB.flatten()[:1200]  # Adjust the size as per your model input

    return S_DB

# Function to predict genre from the .wav file
def predict_genre(file_bytes, clf):
    # Extract features from the .wav file
    mel_features = extractMelSpectrogram_features(file_bytes)

    # Make prediction using the trained model
    genre_label = clf.predict([mel_features])[0]

    # List of genre labels
    genres = ["blues", "classical", "country", "disco", "hiphop", "jazz", "metal", "pop", "reggae", "rock"]

    # Return the predicted genre
    return genres[genre_label]

# Load the pre-trained model once when the server starts
try:
    with open(model_path, 'rb') as f:
        clf = pickle.load(f)
except Exception as e:
    print(f"Error loading model: {e}")
    clf = None

@app.route('/predict_svm', methods=['POST'])
def predict_svm():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']

    if not file.filename.endswith('.wav'):
        return jsonify({"error": "Invalid file format. Please upload a .wav file"}), 400

    file_bytes = file.read()

    if clf is None:
        return jsonify({"error": "Model is not loaded properly."}), 500

    try:
        predicted_genre = predict_genre(file_bytes, clf)
        return jsonify({"genre": predicted_genre})
    except Exception as e:
        return jsonify({"error": f"Error in prediction: {e}"}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
