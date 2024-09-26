require('dotenv').config();
const https = require('https');
const fs = require('fs');
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 7898;

// Configure middleware
app.use(bodyParser.json());

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


// Use routes


// SSL options
const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/evergladefoundation.tech/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/evergladefoundation.tech/fullchain.pem')
};

// Start HTTPS server
https.createServer(options, app).listen(port, () => {
    console.log(`HTTPS Server running on port ${port}`);
});
