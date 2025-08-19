const clipboardEx = require("electron-clipboard-ex");
const fs = require("fs").promises;

let lastFilePath = null;

const readApk = async () => {
  try {
    const files = clipboardEx.readFilePaths();
    if (!files.length) {
      return null;
    }

    const filePath = files[0];
    console.log(filePath)
    console.log(lastFilePath)
    if (filePath === lastFilePath) {
      // same file as before, skip
      return null;
    }

    console.log("Reading new APK:", filePath);
    const fileBuff = await fs.readFile(filePath);

    lastFilePath = filePath;
    return fileBuff;
  } catch (error) {
    console.error("Failed to read clipboard files:", error);
    return null;
  }
};

module.exports = readApk;
