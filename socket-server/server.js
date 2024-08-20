const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: "*",  // Allows all origins, change to specific origin for security
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('A client connected');

    socket.on('validate', (data) => {
        console.log('Validation request:', data);
        setTimeout(() => {
            socket.emit('validationResult', { success: true });
        }, 500);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(3000, () => {
    console.log('Socket server running on http://127.0.0.1:3000');
});
