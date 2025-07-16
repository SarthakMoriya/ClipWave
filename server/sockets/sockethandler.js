module.exports = (io) => {
    io.on('connection', (socket) => {
      console.log('New socket connection:', socket.id);
  
      // Clipboard sharing functionality
      socket.on('clipboard', (data) => {
        console.log('Clipboard data received:', data);
        socket.broadcast.emit('clipboard', data);
      });
      // Clipboard sharing functionality
      socket.on('clipboard-img', (data) => {
        console.log('Clipboard Img received:', data);
        socket.broadcast.emit('clipboard-img', data);
      });
      // Clipboard sharing functionality
      socket.on('clipboard-url', (data) => {
        console.log('Clipboard url received:', data);
        socket.broadcast.emit('clipboard-url', data);
      });
      // Clipboard sharing functionality
      socket.on('clipboard-apk', (data) => {
        console.log('Clipboard apk received:', data);
        socket.broadcast.emit('clipboard-apk', data);
      });
  
      // Add authentication middleware for sockets if needed
      socket.on('authenticate', (token) => {
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
  
      socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
      });
    });
  };
