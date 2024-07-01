#!/bin/bash

# Activate virtual environment
source /home/student/miniconda3/etc/profile.d/conda.sh
conda activate accapp

# Start flask app
python /home/student/accessibility-app/flask-api/app.py