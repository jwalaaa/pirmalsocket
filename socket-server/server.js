const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); // Import cors

const app = express();
const server = http.createServer(app);

// Serve static files for validate.html
app.use(express.static('socket-server'));

// Use CORS middleware to allow cross-origin requests
app.use(cors({
    origin: 'http://127.0.0.1:5500',  // Update to the origin of your validation page
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

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
        // Simulate waiting for validation response
        socket.emit('validationResult', { success: true }); // For simulation
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Endpoint to handle validation responses
app.post('/validation-response', express.json(), (req, res) => {
    const { status } = req.body;
    console.log('Validation response received:', status);
    // Optionally, broadcast this response to clients if needed
    io.emit('validationResult', { success: status === 'success' });
    res.send('Response received');
});

server.listen(3000, () => {
    console.log('Socket server running on http://127.0.0.1:3000');
});
