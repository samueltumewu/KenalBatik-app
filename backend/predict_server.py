from flask import request, jsonify, Flask, flash, request, redirect, url_for, render_template
from flask_cors import CORS
from json import dumps
from werkzeug.utils import secure_filename
from markupsafe import escape
import numpy as np
import traceback
import os
from PIL import Image
import tensorflow as tf
from keras.models import load_model, Model
from keras.preprocessing import image
from keras.applications.imagenet_utils import preprocess_input, decode_predictions
import numpy as np
import sys
import io
from keras import backend as K

# app = Flask(__name__, static_folder='./dist', static_url_path='/')
app = Flask(__name__)
CORS(app)
def set_model():
    K.set_learning_phase(1)
    global model, graph

    path_model_file = 'path/to/best/model'
    model = load_model(path_model_file)

def prepare_image(image, target_size):
    if image.mode != 'RGB':
        image = image.convert('RGB')

    image = image.resize(target_size)
    image = np.array(image)
    image = np.expand_dims(image, axis=0)
    image = image/255.
    image = preprocess_input(image)
    print('Input image shape:', image.shape)

    return image

MOTIF = ['CEPLOK', 'KAWUNG', 'LERENG', 'NITIK', 'PARANG', 'SEMEN', 'LUNGLUNGAN']

@app.route("/")
def index():
    return "server is running"
    # return app.send_static_file('index.html')

@app.route("/batik/api/predict/", methods=["POST"])
def predict():
    data = {"success": False}

    if request.files.get("image"):
        image = request.files['image'].read()
        image = Image.open(io.BytesIO(image))
        image = prepare_image(image, (224,224))

        preds = model.predict(image)[0]
        print(preds*100)

        # get index of the greatest value
        preds_np = np.array(preds)
        data['greatestMotif'] = MOTIF[int(np.argmax(preds_np))]

        data['predictions'] = []
        for i in range(len(preds)):
            data['predictions'].append({
                'label': MOTIF[i],
                'prob': float(preds[i]*100)
            })

        data['success'] = True

        K.clear_session()

        response = jsonify(data)
        return response

if (__name__ == "__main__"):
    set_model()
    app.run(host='0.0.0.0', port = 5000, debug=True, threaded=True)
