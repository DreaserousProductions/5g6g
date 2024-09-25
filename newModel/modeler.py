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
from PIL import Image                    # To read images from source

import tensorflow as tf                  # Main Franework
import keras                             # To create and manage deep neural networks

# Location of main dataset
base_dir  = '/raid/home/naghul/5g6g/kerasModel/kaggle/input/animals-detection-images-dataset/'

# Show main directory containers
os.listdir(base_dir)

# Define train and test folders pathes.
train_dir = os.path.join(base_dir, 'train')
test_dir = os.path.join(base_dir, 'test')

# Number of classes
classes = os.listdir(train_dir)
num_classes = len(classes)

# A variable to store number of images in each class and class names.
counts = []

# Loop over classes
for class_name in classes :
    class_path = os.path.join(train_dir, class_name)
    count = len(os.listdir(class_path))
    counts.append((class_name, count))

# Convert variable to DataFrame
counts = pd.DataFrame(counts, columns=['Class_Names', 'Counts'])

BATCH_SIZE = 32
IMAGE_SIZE = (224, 224)

train_full = keras.utils.image_dataset_from_directory(
    directory=train_dir,
    labels='inferred',
    label_mode='categorical',
    class_names=classes,
    seed=42,
    shuffle=True,
    batch_size=BATCH_SIZE,
    image_size=IMAGE_SIZE,    
)

train_full = train_full.shuffle(1024).prefetch(tf.data.AUTOTUNE)

num_all_batches = len(list(train_full))
print(f'Number of all Batches : {num_all_batches}', 'white', 'on_blue')

num_train_batches = int(num_all_batches * 0.8)
num_valid_test_batches = int(num_all_batches - num_train_batches
)
# Print the TARGET : number of batches for train, validation and test dataset to each
print(' Target : ', 'green')
print('-'*35)
print(f'Number of  Train  batches : {num_train_batches}', 'blue')
print(f'Number of Validation batches : {num_valid_test_batches//2}', 'blue')
print(f'Number of Test batches : {num_valid_test_batches//2}', 'blue')

train_ds = train_full.take(num_train_batches)

remain = train_full.skip(num_train_batches)

valid_ds = remain.take(num_valid_test_batches//2)
test_ds = remain.skip(num_valid_test_batches//2)

# Load VGG19 pretrained model with imagenet weights
pretrained_model = keras.applications.VGG19(
    weights='imagenet', classes=80, input_shape=(224, 224, 3), include_top=False
)

# Show information of ResNet50V2 layers
pretrained_model.summary()


# Freeze all layers, except last layer
# The goal is to train just last layer of pre trained model

pretrained_model.trainable = True                # Whole model is trainable
set_trainable = False                            # Set a flag to False

for layer in pretrained_model.layers :           # A loop over model's layers
    if layer.name == 'block5_conv1' :            # Define target layer's name (with if condition)
        set_trainable = True                     # Change flag value to True
    if set_trainable :                           # A condition for True flag
        layer.trainable = True                   # Set layer trainablity to True
    else :                                       # else condition
        layer.trainable = False                  # For layers befor our target layer

# Add custom layers on top of the base model
model = keras.models.Sequential()
model.add(pretrained_model)                               # At first add our pre-trained model
model.add(keras.layers.Dropout(0.5))                      # Use a Dropout layer to avoid over-fitting
model.add(keras.layers.GlobalAveragePooling2D())          # Apply GlobalAveragePooling2D
model.add(keras.layers.Flatten())                         # Convert the output to 1D arraay
model.add(keras.layers.Dense(1024, activation='relu'))    # Add a Dense layer with 1024 neuron with activation='relu'
model.add(keras.layers.Dropout(0.5))                      # Use a Dropout layer to avoid over-fitting
model.add(keras.layers.Dense(512, activation='relu'))     # Add a Dense layer with 512 neuron with activation='relu'
model.add(keras.layers.Dropout(0.5))                      # Use a Dropout layer to avoid over-fitting
model.add(keras.layers.Dense(80, activation='softmax'))   # Add a Dense layer with number fo classes neuron as output with activation='softmax'

# Model CheckPoint Call-Back, to save best model parameters as a .keras file
checkpoint_cb = keras.callbacks.ModelCheckpoint('MyModel.keras', save_best_only=True) 

# Early Stoping Call-Backc to stop trainig process after 'patience' epochs if the metric doesn't grow
earlystop_cb = keras.callbacks.EarlyStopping(patience=10, restore_best_weights=True)

# ReduceLROnPlateau Call-Back to decrease learning-rate base on 'monitor' parameter after 'patience' epochs with a 'factor' is doesn't improve
reduce_lr = keras.callbacks.ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=3, min_lr=1e-6)

# Compile the model
model.compile(optimizer=keras.optimizers.Adam(learning_rate=0.0001), loss='categorical_crossentropy', metrics=['accuracy'])

# Train model by .fit function
history = model.fit(
    train_ds,                                          # Dataset to train model
    epochs=100,                                        # Number of epochs to train
    validation_data=valid_ds,                          # Validation dataset
    callbacks=[checkpoint_cb, earlystop_cb, reduce_lr] # List of call backs
)