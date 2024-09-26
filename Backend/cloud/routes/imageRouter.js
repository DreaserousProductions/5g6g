// const express = require('express');
// const multer = require('multer');
// const fs = require('fs');
// const path = require('path');
// const { pool } = require('../server'); // Adjust the path based on your structure

// const router = express.Router();

// // Configure multer for file uploads
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const dir = 'uploads'; // Directory to save images
//         fs.exists(dir, (exists) => {
//             if (!exists) {
//                 fs.mkdirSync(dir); // Create the directory if it doesn't exist
//             }
//             cb(null, dir);
//         });
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname)); // Save with a timestamp
//     }
// });

// const upload = multer({ storage: storage });

// router.get('/', (req, res) => {
//     res.json({ message: 'Image Router Working' });
// });

// // Route to handle image upload
// router.post('/', upload.single('image'), (req, res) => {
//     const imagePath = req.file.path;
//     const logEntry = {
//         image_path: imagePath,
//         created_at: new Date()
//     };

//     // Log the upload in MySQL
//     pool.query('INSERT INTO image_logs SET ?', logEntry, (error, results) => {
//         if (error) {
//             console.error('Error inserting into database:', error);
//             return res.status(500).json({ error: 'Database error' });
//         }

//         res.status(200).json({ message: 'Image uploaded successfully', imagePath });
//     });
// });

// module.exports = router;


const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { pool } = require('../server'); // Adjust the path based on your structure
const { exec } = require('child_process'); // For running the Python script

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads'; // Directory to save images
        fs.exists(dir, (exists) => {
            if (!exists) {
                fs.mkdirSync(dir); // Create the directory if it doesn't exist
            }
            cb(null, dir);
        });
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Save with a timestamp
    }
});

const upload = multer({ storage: storage });

router.get('/', (req, res) => {
    res.json({ message: 'Image Router Working' });
});

// Route to handle image upload
router.post('/', upload.single('image'), (req, res) => {
    const imagePath = req.file.path;
    const logEntry = {
        image_path: imagePath,
        created_at: new Date()
    };

    // Log the upload in MySQL
    pool.query('INSERT INTO image_logs SET ?', logEntry, (error, results) => {
        if (error) {
            console.error('Error inserting into database:', error);
            return res.status(500).json({ error: 'Database error' });
        }

        // Call Python script for prediction
        exec(`/home/ec2-user/miniconda3/bin/conda run -n kratos python predict.py "${imagePath}"`, (error, stdout, stderr) => {
            if (error) {
                console.error('Error executing Python script:', error);
                return res.status(500).json({ error: 'Prediction error' });
            }

            // Process the output from the Python script
            const predictedClass = stdout.trim();
            const animalMapping = {
                'Bear': 22, 'Brown bear': 71, 'Bull': 47, 'Butterfly': 17, 'Camel': 70, 'Canary': 72, 'Caterpillar': 17, 'Cattle': 58, 'Centipede': 66, 'Cheetah': 74, 'Chicken': 23, 'Crab': 35, 'Crocodile': 76, 'Deer': 77, 'Duck': 55, 'Eagle': 15, 'Elephant': 46, 'Fish': 52, 'Fox': 5, 'Frog': 44, 'Giraffe': 67, 'Goat': 58, 'Goldfish': 52, 'Goose': 78, 'Hamster': 63, 'Harbor seal': 19, 'Hedgehog': 6, 'Hippopotamus': 30, 'Horse': 4, 'Jaguar': 74, 'Jellyfish': 75, 'Kangaroo': 38, 'Koala': 27, 'Ladybug': 17, 'Leopard': 74, 'Lion': 18, 'Lizard': 35, 'Lynx': 5, 'Magpie': 55, 'Monkey': 63, 'Moths and butterflies': 17, 'Mouse': 63, 'Mule': 67, 'Ostrich': 42, 'Otter': 19, 'Owl': 25, 'Panda': 25, 'Parrot': 55, 'Penguin': 19, 'Pig': 33, 'Polar bear': 28, 'Rabbit': 59, 'Raccoon': 20, 'Raven': 1, 'Red panda': 73, 'Rhinoceros': 21, 'Scorpion': 41, 'Sea lion': 79, 'Sea turtle': 41, 'Seahorse': 52, 'Shark': 10, 'Sheep': 58, 'Shrimp': 0, 'Snail': 48, 'Snake': 9, 'Sparrow': 72, 'Spider': 0, 'Squid': 44, 'Squirrel': 73, 'Starfish': 39, 'Swan': 45, 'Tick': 0, 'Tiger': 34, 'Tortoise': 41, 'Turkey': 15, 'Turtle': 41, 'Whale': 30, 'Woodpecker': 14, 'Worm': 40, 'Zebra': 49
            };

            const animalName = Object.keys(animalMapping).find(key => animalMapping[key] === parseInt(predictedClass));

            console.log(animalName);
            res.status(200).json({ message: 'Image uploaded successfully', imagePath, predictedClass: animalName });
        });
    });
});

module.exports = router;
