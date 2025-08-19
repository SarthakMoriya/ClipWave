const { parentPort } = require("worker_threads");
const clipboardEx = require("electron-clipboard-ex");
const path = require("path");
const fs = require("fs");

let lastFilePath = null;

parentPort.on("message", () => {
  try {
    const files = clipboardEx.readFilePaths();
    if (!files.length) {
      parentPort.postMessage({ success: false, error: "No APK found" });
      return;
    }

    const filePath = files[0];
    if (filePath === lastFilePath) {
      parentPort.postMessage({ success: false, error: "Same file as last, skipping" });
      return;
    }

    lastFilePath = filePath;
    console.log("Reading APK from:", filePath);

    const fileBuff = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    console.log("FILENAME IS:"+fileName)
    parentPort.postMessage({ success: true, fileName, fileData: fileBuff, filePath });
  } catch (error) {
    console.log("ERORRRRRRRRRRRRRRRRR")
    console.log("ERORRRRRRRRRRRRRRRRR")
    console.log(error)
    parentPort.postMessage({ success: false, error: error.message });
  }
});
