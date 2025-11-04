const mime = require("mime-types");
module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("New socket connection:", socket.id);

    // Clipboard sharing functionality
    socket.on("clipboard", (data) => {
      console.log("Clipboard data received:", data);
      socket.broadcast.emit("clipboard", data);
    });
    // Clipboard sharing functionality
    socket.on("clipboard-img", (data) => {
      console.log("Clipboard Img received:", data);
      socket.broadcast.emit("clipboard-img", data);
    });
    // Clipboard sharing functionality
    socket.on("clipboard-url", (data) => {
      console.log("Clipboard url received:", data);
      socket.broadcast.emit("clipboard-url", data);
    });
    // Clipboard sharing functionality
    socket.on("clipboard-apk", (data) => {
      console.log("Clipboard apk received:", data);
      socket.broadcast.emit("clipboard-apk", data);
    });

    const files = {};

    socket.on("clipboard-apk-chunk", ({ fileName, index, total, data }) => {
      if (!files[fileName]) files[fileName] = [];
      files[fileName][index] = Buffer.from(data, "base64");
      console.log(`Received chunk ${index + 1}/${total} for ${fileName}`);
    });

    socket.on("clipboard-apk-complete", ({ fileName }) => {
      const fileBuffer = Buffer.concat(files[fileName]);
      require("fs").writeFileSync(`./uploads/${fileName}`, fileBuffer);
      console.log(`✅ APK ${fileName} saved! Size: ${fileBuffer.length} bytes`);

      let mimeType = mime.lookup(fileName) || "application/octet-stream";
      if (mimeType === "application/mp4") mimeType = "video/mp4";
      if (mimeType === "application/mpeg") mimeType = "video/mpeg";

      console.log(mimeType);
      delete files[fileName];
      socket.broadcast.emit("new-apk-available", {
        fileName,
        name: fileName,
        url: `http://192.168.1.15:3000/uploads/${fileName}`,
        mimeType,
      });
    });

    // Add authentication middleware for sockets if needed
    socket.on("authenticate", (token) => {
      // Verify JWT token here if you want authenticated sockets
      // Example:
      // try {
      //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //   socket.userId = decoded.id;
      //   console.log(`Socket ${socket.id} authenticated as user ${decoded.id}`);
      // } catch (err) {
      //   console.log('Socket authentication failed');
      //   socket.disconnect();
      // }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};
