const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { pool } = require('../server'); // Adjust the path based on your structure

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

        res.status(200).json({ message: 'Image uploaded successfully', imagePath });
    });
});

module.exports = router;
