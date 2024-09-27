require('dotenv').config();
const https = require('https');
const fs = require('fs');
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 443;

// Configure middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json({ limit: '10mb' })); // Adjust the limit as needed
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: process.env.DATABASE_PASSWORD,
    database: 'tcoe',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Export the pool to be used in other modules
module.exports.pool = pool;

// Import routes
const imageRouter = require('./routes/imageRouter');
const liveRouter = require('./routes/live');

app.use('/raspberryImage', imageRouter);
app.use('/live-stream', liveRouter);

// SSL options
const options = {
    key: fs.readFileSync('selfsigned.key'),
    cert: fs.readFileSync('selfsigned.crt')
};

// Start HTTPS server
https.createServer(options, app).listen(port, () => {
    console.log(`HTTPS Server running on port ${port}`);
});