const express = require('express');
const path = require('path');
const router = express.Router();

// Serve the live stream HTML page
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'stream.html')); // Adjust the path if necessary
});

module.exports = router;