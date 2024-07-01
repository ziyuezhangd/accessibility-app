from flask import Flask, request, jsonify
import pickle
import pandas as pd
import json

app = Flask(__name__)

# All segment IDs for Manhattan
with open('../ml/output/segment_to_lat_long.json', 'r') as f:
  data = json.load(f)
segment_ids = list(data.keys())

# All MODZCTA for Manhattan here
MODZCTAs = ["zipcode1", "zipcode2"]

def load_model(model_path):
  try:
    with open(model_path, 'rb') as model_file:
      model = pickle.load(model_file)
    return model
  except Exception:
    return None

@app.route('/noise-ratings', methods=['GET'])
def predict_noise():
  model = load_model('../ml/models/noise_model.pkl')
  
  if model is None:
    return jsonify({'error': 'Model not found or could not be loaded'}), 500

  hour = request.args.get('hour', type=int)
  if hour is None:
    return jsonify({'error': 'hour parameter is required'}), 400
  
  inputs = pd.DataFrame({'Hour': [hour] * len(segment_ids), 'SegmentId': segment_ids})
  
  predictions = model.predict(inputs)

  results = [{'segment_id': segment_id, 'prediction': prediction} for segment_id, prediction in zip(segment_ids, predictions)]
  
  return jsonify(results)

@app.route('/busyness-ratings', methods=['GET'])
def predict_busyness():
  model = load_model('../ml/models/busyness_model.pkl')
  
  if model is None:
    return jsonify({'error': 'Model not found or could not be loaded'}), 500
  
  month = request.args.get('month', type=int)
  day = request.args.get('day', type=int)
  hour = request.args.get('hour', type=int)
  day_of_week = request.args.get('dayOfWeek', type=int)

  if month is None or day is None or hour is None or day_of_week is None:
    return jsonify({'error': 'month, day, hour and dayOfWeek parameters are required'}), 400
  
  inputs = pd.DataFrame({
    'SegmentId': segment_ids,
    'month': [month] * len(segment_ids),
    'day': [day] * len(segment_ids),
    'hour': [hour] * len(segment_ids),
    'DayofWeek': [day_of_week] * len(segment_ids)
  })
  
  predictions = model.predict(inputs)

  results = [{'segment_id': segment_id, 'prediction': prediction} for segment_id, prediction in zip(segment_ids, predictions)]
  
  return jsonify(results)

@app.route('/odour-ratings', methods=['GET'])
def predict_odour():
  model = load_model('../ml/models/odor_model.pkl')
  
  if model is None:
    return jsonify({'error': 'Model not found or could not be loaded'}), 500
  
  month = request.args.get('month', type=int)
  day = request.args.get('day', type=int)
  hour = request.args.get('hour', type=int)
  day_of_week = request.args.get('dayOfWeek', type=int)

  if month is None or day is None or hour is None or day_of_week is None:
    return jsonify({'error': 'month, day, hour and dayOfWeek parameters are required'}), 400

  inputs = pd.DataFrame({
    'MODZCTA': MODZCTAs,
    'month': [month] * len(MODZCTAs),
    'day': [day] * len(MODZCTAs),
    'hour': [hour] * len(MODZCTAs),
    'DayofWeek': [day_of_week] * len(MODZCTAs)
  })
  
  predictions = model.predict(inputs)

  results = [{'MODZCTA': modzcta, 'prediction': prediction} for modzcta, prediction in zip(MODZCTAs, predictions)]
  
  return jsonify(results)

if __name__ == '__main__':
  app.run(debug=True, host='0.0.0.0', port=8000)