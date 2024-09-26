# A libraries to avoid keras and tensorflow warnings
from silence_tensorflow import silence_tensorflow
silence_tensorflow()

# A libraries to avoid other warnings
from warnings import filterwarnings
filterwarnings('ignore')

import os                                # To work with operation system comands
import pandas as pd                      # To work with DataFrames
import numpy as np                       # To work with arrays
import random                            # To generate random number and choices
import matplotlib.pyplot as plt          # To create plots and visualizations
import seaborn as sns                    # To create plots and visualizations
from termcolor import colored            # To create colorfull output
from PIL import Image                    # To read images from source

import tensorflow as tf                  # Main Franework

from keras.models import load_model
from keras.preprocessing import image

# Load the model
best_model = load_model('MyModel.keras')

# Load and preprocess the image
img_path = 'image.jpg'  # Update with your image path
img = image.load_img(img_path, target_size=(224, 224))
img_array = image.img_to_array(img)
img_array = np.expand_dims(img_array, axis=0)
img_array /= 255.0  # Normalize if necessary

# Make predictions
predictions = best_model.predict(img_array)

# Output the predictions
print(predictions)

# For classification
predicted_class = np.argmax(predictions)
print(f"Predicted class: {predicted_class}")
