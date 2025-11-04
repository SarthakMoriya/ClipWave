const { parentPort } = require("worker_threads");
const clipboardEx = require("electron-clipboard-ex");
const path = require("path");
const fs = require("fs");

let lastFilePath = null;

parentPort.on("message", () => {
  try {
    const files = clipboardEx.readFilePaths();
    if (!files.length) {
      parentPort.postMessage({ success: false, error: "No APK/File found" });
      return;
    }

    const filePath = files[0];
    console.log(`Copied File path::${filePath}`);
    if (filePath === lastFilePath) {
      parentPort.postMessage({
        success: false,
        error: "Same file/apk as last, skipping",
      });
      return;
    }

    lastFilePath = filePath;

    const fileBuff = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    const ext = path.extname(fileName).toLowerCase();
    const mimeType =
      ext === ".mp4"
        ? "video/mp4"
        : ext === ".apk"
        ? "application/vnd.android.package-archive"
        : "application/octet-stream";
    const base64Data = fileBuff.toString("base64");// maybe just for videos

    console.log("File name::" + fileName);
    parentPort.postMessage({
      success: true,
      fileName,
      // fileData: fileBuff,
      fileData: base64Data,
      mimeType,
      filePath,
    });
  } catch (error) {
    console.log(error);
    parentPort.postMessage({ success: false, error: error.message });
  }
});
