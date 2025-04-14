module.exports = (io) => {
    io.on('connection', (socket) => {
      console.log('New socket connection:', socket.id);
  
      // Clipboard sharing functionality
      socket.on('clipboard', (data) => {
        console.log('Clipboard data received:', data);
        socket.broadcast.emit('clipboard', data);
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