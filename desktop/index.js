const readApk = require("./readApk");
const { app, clipboard } = require("electron");
const { io } = require("socket.io-client");
const { Worker } = require("worker_threads");

let socket;
let apkWorker;
let previousClipboardContent = "";
let previousImgBase64 = null;

// ✅ Create worker once
function initApkWorker() {
  apkWorker = new Worker("./apkWorker.js");

  apkWorker.on("message", (result) => {
    if (!result.success) {
      console.log("APK Worker error:", result.error);
      return;
    }

    console.log("📦 Sending APK/File:", result.fileName);

    // Split into 256 KB chunks
    const CHUNK_SIZE = 256 * 1024;
    // const fileData = Buffer.from(result.fileData);
    const fileData = Buffer.from(result.fileData, "base64");
    // const fileData = result.fileData;
    const totalChunks = Math.ceil(fileData.length / CHUNK_SIZE);

    // saves to server's upload folder
    for (let i = 0; i < totalChunks; i++) {
      const chunk = fileData.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
      socket.emit("clipboard-apk-chunk", {
        fileName: result.fileName,
        mimeType: result.mimeType,
        index: i,
        total: totalChunks,
        data: chunk.toString("base64"),
      });
    }

    // sends filename so clients can request that file in uploads folder
    socket.emit("clipboard-apk-complete", {
      fileName: result.fileName,
      mimeType: result.mimeType,
    });
  });

  apkWorker.on("error", (err) => {
    console.error("Worker thread error:", err);
  });
}

function establishSocketConnection() {
  socket = io("http://192.168.1.15:3000");
  // socket = io("http://192.168.1.14:3000");

  socket.on("connect", () => {
    console.log("✅ Connected to Socket");
  });

  socket.on("clipboard", (data) => {
    console.log("📋 Clipboard data received:", data);
  });

  // Run checks every 5s
  setInterval(() => {
    checkClipBoard();
    checkImage();
    checkForApkFiles();
  }, 5000);
}

function checkClipBoard() {
  const clipboardContent = clipboard.readText();
  if (clipboardContent !== previousClipboardContent) {
    if (checkForUrls(clipboardContent)) {
      console.log("🌍 Emitting URL:", clipboardContent);
      socket.emit("clipboard-url", clipboardContent);
    } else {
      console.log("📋 Emitting text:", clipboardContent);
      socket.emit("clipboard", clipboardContent);
    }
    previousClipboardContent = clipboardContent;
  } else {
    checkImage();
  }
}

function checkImage() {
  const currentImage = clipboard.readImage();
  if (!currentImage.isEmpty()) {
    const base64Image = currentImage.toDataURL();
    if (previousImgBase64 !== base64Image) {
      console.log("🖼️ Sending new image from clipboard");
      socket.emit("clipboard-img", base64Image);
      previousImgBase64 = base64Image;
    }
  }else{
    console.log('Empty Clipboard...')
  }
}

function checkForUrls(data) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return !!data.match(urlRegex);
}

function checkForApkFiles() {
  // Just tell worker to check
  apkWorker.postMessage("read");
}

app.whenReady().then(() => {
  initApkWorker();
  establishSocketConnection();
});
