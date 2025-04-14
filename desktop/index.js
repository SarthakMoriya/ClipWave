try {
  const { app, clipboard } = require("electron");
  const { io } = require("socket.io-client");

  app.whenReady().then(() => {
    establishSocketConnection();
  });

  let socket;
  let previousClipboardContent = "";
  let previousImg='';

  establishSocketConnection = () => {
    socket = io("http://192.168.29.22:3000");

    socket.on("connect", () => {
      console.log("Connected to Socket");
    });

    socket.on("clipboard", (data) => {
      console.log("COPIED DATA RECIEVED", data);
    });

    setInterval(() => {
      checkClipBoard();
      // checkImage();
    }, 5000);
  };

  checkClipBoard = () => {
    const clipboardContent = clipboard.readText();
    if (clipboardContent !== previousClipboardContent) {
      socket.emit("clipboard", clipboardContent);
      previousClipboardContent = clipboardContent;
      console.log("CurrClipborad is" + clipboardContent);
      console.log("Previous Clipborad is" + previousClipboardContent);
    } else {
      checkImage();
    }
  };

  let previousImgBase64 = null; // Store base64 of the previous image

  const checkImage = () => {
    console.log("I am being called");
  
    // Read the image from the clipboard
    const currentImage = clipboard.readImage();
  
    if (!currentImage.isEmpty()) {
      const base64Image = currentImage.toDataURL(); // Convert the image to base64 format
  
      // Check if the image is different from the previous one
      if (previousImgBase64 !== base64Image) {
        socket.emit("clipboard-img", base64Image); // Emit the base64 image
        console.log(base64Image); // For debugging
  
        // Store the base64 string for comparison on next calls
        previousImgBase64 = base64Image;
      } else {
        console.log("Image is the same as before, not sending again.");
      }
    } else {
      console.log("Clipboard is empty or no image detected.");
    }
  };
  
} catch (error) {
  console.log(error);
}
