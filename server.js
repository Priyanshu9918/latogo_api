const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// Create server
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // React frontend ka URL
    methods: ["GET", "POST"]
  }
});

// Global access ke liye set kar diya
app.set("io", io);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/category', require('./routes/categoryRoutes'));
app.use('/api/level', require('./routes/levelRoutes'));
app.use('/api/course', require('./routes/courseRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
