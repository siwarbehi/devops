from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import joblib
import librosa
import numpy as np

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Load the SVM model
model_path = './models/model.pkl'
svm_model = joblib.load(model_path)

def extract_features(file_path):
    y, sr = librosa.load(file_path, sr=None)  # Load audio
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=2)  # Compute only 2 MFCCs
    mfccs_mean = np.mean(mfccs.T, axis=0)  # Take the mean of MFCCs
    return mfccs_mean

def classify_music(file_path):
    features = extract_features(file_path)  # Extract features
    features = features.reshape(1, -1)  # Reshape for the model
    genre = svm_model.predict(features)[0]  # Predict genre
    return genre

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(file_path)

    try:
        genre = classify_music(file_path)
        return jsonify({"genre": genre})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
