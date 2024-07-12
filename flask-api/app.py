from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import json
import logging
import numpy as np

app = Flask(__name__)
CORS(app)

# All segment IDs for Manhattan
with open('../ml/output/segment_to_lat_long.json', 'r') as f:
  segment_data = json.load(f)
segment_ids = list(segment_data.keys())
num_segments = len(segment_ids)

# All MODZCTA for Manhattan here
with open('../ml/output/MODZCTA_Centerpoints.json', 'r') as f:
  MODZCTA_data = json.load(f)
MODZCTAs = list(MODZCTA_data.keys())
num_MODZCTAs = len(MODZCTAs)

def load_model(model_path):
  try:
    with open(model_path, 'rb') as model_file:
      model = pickle.load(model_file)
    return model
  except Exception:
    return None

# Load models
noise_hourly_model = load_model('../ml/models/noise_model_hourly.pkl')
noise_daily_model = load_model('../ml/models/noise_model_daily.pkl')
busyness_model = load_model('../ml/models/busyness_model.pkl')
odour_model = load_model('../ml/models/odor_model.pkl')


@app.route('/noise-ratings/hourly', methods=['GET'])
def predict_noise_hourly():
  if noise_hourly_model is None:
    return jsonify({'error': 'Model not found or could not be loaded'}), 500

  hour = request.args.get('hour', type=int)

  if hour is None or hour < 0 or hour > 23:
    return jsonify({'error': f'hour parameter {hour} is invalid'}), 400
  
  inputs = pd.DataFrame({
    'Hour': np.full(num_segments, hour, dtype=int), 
    'SegmentId': segment_ids
  })
  
  predictions = noise_hourly_model.predict(inputs)
  predictions = predictions.astype(int).tolist()

  results = [{'segment_id': segment_id, 'prediction': prediction} for segment_id, prediction in zip(segment_ids, predictions)]
  
  return jsonify(results)

@app.route('/noise-ratings/daily', methods=['GET'])
def predict_noise_daily():
  if noise_daily_model is None:
    return jsonify({'error': 'Model not found or could not be loaded'}), 500

  hour = request.args.get('hour', type=int)
  day_of_week = request.args.get('dayOfWeek', type=int)

  if hour is None or hour < 0 or hour > 23:
    return jsonify({'error': f'hour parameter {hour} is invalid'}), 400
  if day_of_week is None or day_of_week < 0 or day_of_week > 6:
    return jsonify({'error': f'day_of_week parameter {day_of_week} is invalid'}), 400
  
  inputs = pd.DataFrame({
    'Hour': np.full(num_segments, hour, dtype=int),
    'DayOfWeek': np.full(num_segments, day_of_week, dtype=int),
    'SegmentId': segment_ids
    })
  
  predictions = noise_daily_model.predict(inputs)
  predictions = predictions.astype(int).tolist()

  results = [{'segment_id': segment_id, 'prediction': prediction} for segment_id, prediction in zip(segment_ids, predictions)]
  
  return jsonify(results)

@app.route('/busyness-ratings', methods=['GET'])
def predict_busyness():
  if busyness_model is None:
    return jsonify({'error': 'Model not found or could not be loaded'}), 500
  
  month = request.args.get('month', type=int)
  day = request.args.get('day', type=int)
  hour = request.args.get('hour', type=int)
  day_of_week = request.args.get('dayOfWeek', type=int)

  if hour is None or hour < 0 or hour > 23:
    return jsonify({'error': f'hour parameter {hour} is invalid'}), 400
  if day is None or day < 0 or day > 31:
    return jsonify({'error': f'day parameter {day} is invalid'}), 400
  if month is None or month < 1 or month > 12:
    return jsonify({'error': f'month parameter {month} is invalid'}), 400
  if day_of_week is None or day_of_week < 0 or day_of_week > 6:
    return jsonify({'error': f'day_of_week parameter {day_of_week} is invalid'}), 400
  
  inputs = pd.DataFrame({
    'SegmentID': segment_ids,
    'month': np.full(num_segments, month, dtype=int),
    'day': np.full(num_segments, day, dtype=int),
    'hour': np.full(num_segments, hour, dtype=int),
    'DayofWeek': np.full(num_segments, day_of_week, dtype=int)
  })
  
  predictions = busyness_model.predict(inputs)

  results = [{'segment_id': segment_id, 'prediction': prediction} for segment_id, prediction in zip(segment_ids, predictions)]
  
  return jsonify(results)

@app.route('/odour-ratings', methods=['GET'])
def predict_odour():
  if odour_model is None:
    return jsonify({'error': 'Model not found or could not be loaded'}), 500
  
  month = request.args.get('month', type=int)
  day = request.args.get('day', type=int)
  hour = request.args.get('hour', type=int)

  if hour is None or hour < 0 or hour > 23:
    return jsonify({'error': f'hour parameter {hour} is invalid'}), 400
  if day is None or day < 0 or day > 31:
    return jsonify({'error': f'day parameter {day} is invalid'}), 400
  if month is None or month < 1 or month > 12:
    return jsonify({'error': f'month parameter {month} is invalid'}), 400

  inputs = pd.DataFrame({
    'MODZCTA': MODZCTAs,
    'month': np.full(num_MODZCTAs, month, dtype=int),
    'day': np.full(num_MODZCTAs, day, dtype=int),
    'hour': np.full(num_MODZCTAs, hour, dtype=int),
  })
  
  predictions = odour_model.predict(inputs)

  results = [{'MODZCTA': modzcta, 'prediction': prediction} for modzcta, prediction in zip(MODZCTAs, predictions)]
  
  return jsonify(results)

if __name__ == '__main__':
  app.run(host='0.0.0.0', port=5000)
else:
  application=app