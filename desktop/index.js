const readApk = require("./readApk");

try {
  const { app, clipboard } = require("electron");
  const { io } = require("socket.io-client");

  app.whenReady().then(() => {
    establishSocketConnection();
  });

  let socket;
  let previousClipboardContent = "";
  let previousImg = "";

  establishSocketConnection = () => {
    socket = io("http://192.168.1.106:3000");
    // "https://192.168.1.16:3000"

    socket.on("connect", () => {
      console.log("Connected to Socket");
    });

    socket.on("clipboard", (data) => {
      console.log("COPIED DATA RECIEVED", data);
    });

    setInterval(() => {
      // checkClipBoard();
      checkImage();
      checkForAPkFiles();
    }, 5000);
  };

  checkClipBoard = () => {
    const clipboardContent = clipboard.readText();
    if (clipboardContent !== previousClipboardContent) {
      // Check if the clipboard content is a URL
      if (checkForUrls(clipboardContent)) {
        console.log("Emitting URLS");
        socket.emit("clipboard-url", clipboardContent);
      } else {
        console.log("EMITTING DATA...." + clipboardContent);
        socket.emit("clipboard", clipboardContent);
      }
      previousClipboardContent = clipboardContent;
    } else {
      checkImage();
    }
  };

  let previousImgBase64 = null; // Store base64 of the previous image

  const checkImage = () => {
    // Read the image from the clipboard
    const currentImage = clipboard.readImage();
    console.log(currentImage.isEmpty());

    if (!currentImage.isEmpty()) {
      const base64Image = currentImage.toDataURL(); // Convert the image to base64 format

      // Check if the image is different from the previous one
      if (previousImgBase64 !== base64Image) {
        socket.emit("clipboard-img", base64Image); // Emit the base64 image

        // Store the base64 string for comparison on next calls
        previousImgBase64 = base64Image;
      } else {
        console.log("Image is the same as before, not sending again.");
      }
    } else {
      console.log("Clipboard is empty or no image detected.");
    }
  };

  const checkForUrls = (data) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g; // Regex to match URLs
    const urls = data.match(urlRegex);
    if (urls) {
      return true;
    } else {
      return false;
    }
  };

  const checkForAPkFiles = async (data) => {
    try {
      const apk = await readApk();
      socket.emit("clipboard-apk", {
        fileName: "test.apk",
        fileData: apk.toString("base64"), // Send as Base64 if needed
      });
    } catch (error) {
      console.log(error);
    }
  };
} catch (error) {
  console.log(error);
}
