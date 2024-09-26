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
import keras                             # To create and manage deep neural networks