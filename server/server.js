const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const User = require('./model/authModel');
require('dotenv').config();

const app = express();
const httpServer = createServer(app);

// Configure Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Adjust this in production
    methods: ["GET", "POST"]
  }
})

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));

// Socket.io connection handler
require('./sockets/socketHandler')(io);

// Initialize database and start server
const PORT = process.env.PORT || 3000;
const initializeApp = async () => {
  try {
    await User.createTable();
    console.log('Database initialized');
    
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Socket.io is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize app:', error);
    process.exit(1);
  }
};

initializeApp();