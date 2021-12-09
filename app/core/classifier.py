import os

import pandas as pd
import numpy as np
import joblib
import librosa
from datetime import datetime


def load_model(model_path):
    """
    Loads the model from the path specified.
    """
    return joblib.load(model_path)


def predict(model, file_name):
    """
    Predicts the class of the input data.
    """
    sr = librosa.get_samplerate(file_name)
    prev = datetime.now()
    X = get_features(file_name, fs=sr, scale_audio=True, onlySingleDigit=True)
    print("Time taken to get features: ", datetime.now() - prev)
    X = X.reshape(1, 3)
    print(X)
    print(X.shape)
    prediction = model.predict(X)[0]
    # prediction_proba = model.predict_proba(X)
    return prediction


def getPitch(x, fs, winLen=0.02):
    """
    Get the pitch of the audio file
    """
    # winLen = 0.02
    p = winLen * fs
    frame_length = int(2 ** int(p - 1).bit_length())
    hop_length = frame_length // 2
    f0, voiced_flag, voiced_probs = librosa.pyin(
        y=x, fmin=80, fmax=450, sr=fs, frame_length=frame_length, hop_length=hop_length
    )
    return f0, voiced_flag


def get_features(file_name, fs=None, scale_audio=False, onlySingleDigit=False):
    """
    Get the features from the file
    """
    x, fs = librosa.load(file_name, sr=fs)
    duration = librosa.get_duration(x, sr=fs)
    if scale_audio:
        x = x / np.max(np.abs(x))
    f0, voiced_flag = getPitch(x, fs, winLen=0.02)

    pitch_mean = np.nanmean(f0) if np.mean(np.isnan(f0)) < 1 else 0
    pitch_std = np.nanstd(f0) if np.mean(np.isnan(f0)) < 1 else 0
    tempo = librosa.beat.tempo(x, sr=fs)[0]

    return np.array([pitch_mean, pitch_std, tempo])
