import sys
import numpy as np

# A libraries to avoid keras and tensorflow warnings
from silence_tensorflow import silence_tensorflow
silence_tensorflow()

from keras.models import load_model
from keras.preprocessing import image

# Load the model
best_model = load_model('/home/ec2-user/projects/tcoe/Backend/cloud/model/trueModel.keras')

# Get the image path from command line arguments
img_path = sys.argv[1]

# Load and preprocess the image
img = image.load_img(img_path, target_size=(224, 224))
img_array = image.img_to_array(img)
img_array = np.expand_dims(img_array, axis=0)

# Make predictions
predictions = best_model.predict(img_array)

# Output the predicted class
predicted_class = np.argmax(predictions)
print("!!$C")
print(predicted_class)
