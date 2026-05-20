const express = require("express");
const cors = require("cors");
const path = require("path");
const os = require("os");
const { createServer } = require("http");
const { Server } = require("socket.io");
const User = require("./model/authModel");
require("dotenv").config();

const app = express();
const httpServer = createServer(app);

// Configure Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

const APK_DIR = path.join(process.cwd(), "uploads");
console.log("Uploads Directory:", APK_DIR);

// Serve uploads publicly
app.use("/uploads", express.static(APK_DIR));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));

// Socket.io connection handler
require("./sockets/sockethandler")(io);

// Function to get local IP addresses
function getLocalIPs() {
  const interfaces = os.networkInterfaces();
  const ips = [];

  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === "IPv4" && !net.internal) {
        ips.push(net.address);
      }
    }
  }

  return ips;
}

// Initialize database and start server
const PORT = process.env.PORT || 3000;

const initializeApp = async () => {
  try {
    await User.createTable();
    console.log("Database initialized");

    // Listen on all network interfaces
    httpServer.listen(PORT, "0.0.0.0", () => {
      console.log(`\n🚀 Server running on port ${PORT}`);
      console.log(`📡 Socket.io listening on port ${PORT}\n`);

      const ips = getLocalIPs();

      console.log("Accessible URLs:");

      ips.forEach((ip) => {
        console.log(`➡️  http://${ip}:${PORT}`);
      });

      console.log(`➡️  http://localhost:${PORT}\n`);
    });
  } catch (error) {
    console.error("Failed to initialize app:", error);
    process.exit(1);
  }
};

initializeApp();