# Smart Wildlife Detection System

## Overview

The Smart Wildlife Detection System is developed for the 5G/6G Hackathon by Team Sentinels. This innovative solution aims to monitor wildlife activity along forest roads through a network of Raspberry Pi units equipped with PIR sensors and cameras. Users can receive real-time alerts and live camera feeds through a Flutter application. The cloud infrastructure, built with Node.js, handles machine learning processing and data management.

## Directory Structure

```
/SmartWildlifeDetectionSystem
│
├── userApp/                  # User application built with Flutter
│   ├── android/              # Android-specific code and resources
│   ├── ios/                  # iOS-specific code and resources
│   ├── lib/                  # Dart source code for the application
│   ├── assets/               # Images, icons, and other assets
│   ├── test/                 # Unit and widget tests for the app
│   └── README.md             # Readme for userApp
│
├── cloudBackend/             # Cloud-based infrastructure using Node.js
│   ├── model/                # Machine learning models
│   ├── routes/               # API routes for data handling
│   ├── controllers/          # Business logic for handling requests
│   ├── config/               # Configuration files (environment variables)
│   ├── middleware/           # Middleware for request handling
│   ├── scripts/              # Scripts for data handling and processing
│   └── README.md             # Readme for cloudBackend
│
└── wildlifeUnit/             # Raspberry Pi code using Python
    ├── src/                  # Source code for the unit
    ├── configs/              # Configuration files for the unit
    ├── docs/                 # Documentation related to the unit
    ├── tests/                # Unit tests for the unit code
    └── README.md             # Readme for wildlifeUnit
```

## Project Walkthrough

### 1. Introduction

This project is designed to enhance wildlife conservation efforts by providing a smart monitoring solution. The system consists of three main components:

- **Wildlife Unit**: A Raspberry Pi unit equipped with a PIR sensor and camera for local wildlife detection.
- **Cloud Backend**: A Node.js server that processes data, performs machine learning analysis, and manages user notifications.
- **User App**: A mobile application built with Flutter that allows users to receive alerts and view live feeds.

### 2. Getting Started

#### Prerequisites

- **Hardware**:
  - Raspberry Pi (any model with camera support)
  - PIR Motion Sensor
  - Camera Module (compatible with Raspberry Pi)
  - Wi-Fi Module (if not built-in)

- **Software**:
  - Raspbian OS (for Raspberry Pi)
  - Python 3.x (for wildlife unit code)
  - Node.js (for cloud backend)
  - Flutter SDK (for the user application)
  - TensorFlow.js or a pre-trained model for ML (optional)

#### Installation Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/SmartWildlifeDetectionSystem.git
   cd SmartWildlifeDetectionSystem
   ```

2. **Set Up the Wildlife Unit**:
   - Navigate to `wildlifeUnit/src` and follow the instructions in the `README.md` to install required libraries and run the detection script.
   - Install necessary packages:
     ```bash
     sudo apt-get update
     sudo apt-get install python3-picamera
     pip install requests
     ```

3. **Set Up the Cloud Backend**:
   - Navigate to `cloudBackend` and follow the instructions in `README.md` to set up the Node.js environment and start the server.
   - Install required dependencies:
     ```bash
     cd cloudBackend
     npm install
     ```

4. **Set Up the User Application**:
   - Navigate to `userApp` and follow the instructions in `README.md` to install Flutter dependencies and run the application.
   - Ensure Flutter is set up:
     ```bash
     flutter pub get
     ```

### 3. Wildlife Unit Implementation

#### Structure

- **Motion Detection**: The PIR sensor monitors animal movement and triggers the camera.
- **Camera Capture**: Captures images or video upon motion detection.
- **Data Transmission**: Sends captured data to the cloud and alerts users.

#### Example Code

```python
# wildlifeUnit/src/main.py

import time
import picamera
import RPi.GPIO as GPIO
import requests

# GPIO setup
PIR_PIN = 4
GPIO.setmode(GPIO.BCM)
GPIO.setup(PIR_PIN, GPIO.IN)

camera = picamera.PiCamera()

def detect_motion():
    while True:
        if GPIO.input(PIR_PIN):
            print("Motion detected!")
            camera.capture('image.jpg')
            send_data_to_cloud('image.jpg')
        time.sleep(1)

def send_data_to_cloud(image_path):
    files = {'file': open(image_path, 'rb')}
    response = requests.post('http://cloud-service-url/upload', files=files)
    print("Data sent to cloud:", response.status_code)

if __name__ == "__main__":
    try:
        detect_motion()
    except KeyboardInterrupt:
        GPIO.cleanup()
```

### 4. Cloud Backend Implementation

#### Structure

- **API Routes**: Handles incoming requests and routes them to appropriate controllers.
- **Controllers**: Contains the business logic for processing data and managing user notifications.
- **Middleware**: Custom middleware for error handling and request validation.

#### Example API Code

```javascript
// cloudBackend/routes/api.js

const express = require('express');
const router = express.Router();
const { uploadImage } = require('../controllers/imageController');

router.post('/upload', uploadImage);

module.exports = router;
```

```javascript
// cloudBackend/controllers/imageController.js

const { processImage } = require('../model/imageProcessing');

exports.uploadImage = (req, res) => {
    const file = req.files.file;
    if (!file) {
        return res.status(400).json({ error: "No file provided" });
    }
    
    processImage(file)
        .then(result => res.status(200).json({ result }))
        .catch(err => res.status(500).json({ error: err.message }));
};
```

### 5. User Application

#### Structure

- **User Interface**: Built using Flutter, providing an intuitive way for users to interact with the system.
- **Notifications**: Uses Firebase Cloud Messaging (FCM) for real-time alerts.

#### Example Code Snippet

```dart
// userApp/lib/main.dart

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
    @override
    Widget build(BuildContext context) {
        return MaterialApp(
            title: 'Wildlife Alerts',
            home: AlertsScreen(),
        );
    }
}

class AlertsScreen extends StatefulWidget {
    @override
    _AlertsScreenState createState() => _AlertsScreenState();
}

class _AlertsScreenState extends State<AlertsScreen> {
    List<String> alerts = [];

    @override
    void initState() {
        super.initState();
        fetchAlerts();
    }

    Future<void> fetchAlerts() async {
        final response = await http.get(Uri.parse('http://cloud-service-url/api/alerts'));
        if (response.statusCode == 200) {
            setState(() {
                alerts = List<String>.from(response.body);
            });
        } else {
            throw Exception('Failed to load alerts');
        }
    }

    @override
    Widget build(BuildContext context) {
        return Scaffold(
            appBar: AppBar(title: Text('Wildlife Alerts')),
            body: ListView.builder(
                itemCount: alerts.length,
                itemBuilder: (context, index) {
                    return ListTile(title: Text(alerts[index]));
                },
            ),
        );
    }
}
```

### 6. Testing

- Each folder includes a `tests` directory containing unit and integration tests.
- To run tests, use the following commands in the respective directories:
  ```bash
  # For wildlifeUnit
  cd wildlifeUnit
  pytest tests/
  
  # For cloudBackend
  cd cloudBackend
  npm test
  
  # For userApp
  cd userApp
  flutter test
  ```

### 7. Contribution

Contributions are welcome! Please fork the repository, create a new branch, and submit a pull request. Ensure your code adheres to project standards and includes appropriate tests.

### 8. License

This project is licensed under the MIT License - see the LICENSE file for details.

### 9. Acknowledgments

- [Raspberry Pi Foundation](https://www.raspberrypi.org/)
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Flutter](https://flutter.dev/)
- [TensorFlow.js](https://www.tensorflow.org/js)
- Team Sentinels for participating in the 5G/6G Hackathon.

### 10. Contact

For any questions or suggestions, please reach out via GitHub Issues or contact the repository maintainer.  