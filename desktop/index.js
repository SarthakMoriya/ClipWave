const { app } = require("electron");
const { io } = require("socket.io-client");

app.whenReady().then(() => {
  establishSocketConnection();
});

establishSocketConnection = () => {
  const socket = io("http://192.168.1.16:3000");

  socket.on("connect", () => {
    console.log("Connected to Socket");
  });

  socket.on("clipboard", (data) => {
    console.log("COPIED DATA RECIEVED", data);
  });
};
