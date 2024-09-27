const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.get('/', (req, res) => {
    res.send('<h1>Live Stream Server</h1>');
});

// Handle the incoming stream from Raspberry Pi
io.on('connection', (socket) => {
    console.log('Client connected');

    // When a stream starts
    socket.on('start-stream', () => {
        // Emit the stream to all connected clients
        socket.broadcast.emit('stream', 'video-url-or-base64-data');
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Start the server
const PORT = process.env.PORT;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
