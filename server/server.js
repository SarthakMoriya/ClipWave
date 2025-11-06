const express = require("express");
const cors = require("cors");
const path=require('path')
const { createServer } = require("http");
const { Server } = require("socket.io");
const User = require("./model/authModel");
require("dotenv").config();

const app = express();
const httpServer = createServer(app);

// Configure Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Adjust this in production
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

const APK_DIR = path.join(process.cwd(), "uploads");
console.log(APK_DIR)
// 👇 serve APK files publicly
app.use("/uploads", express.static(APK_DIR));


// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));


// Socket.io connection handler
require("./sockets/sockethandler")(io);

// Initialize database and start server
const PORT = process.env.PORT || 3000;
const initializeApp = async () => {
  try {
    await User.createTable();
    console.log("Database initialized");

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Socket.io is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to initialize app:", error);
    process.exit(1);
  }
};

initializeApp();
