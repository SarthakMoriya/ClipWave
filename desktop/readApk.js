const clipboardEx = require('electron-clipboard-ex');
const fs=require('fs')

const readApk = async () => {
  try {
    const files = await clipboardEx.readFilePaths();
    console.log("Copied files:", files);
    const fileBuff=fs.readFileSync(files[0]);
    return fileBuff;
  } catch (error) {
    console.error("Failed to read clipboard files:", error);
    return null;
  }
};

module.exports = readApk;
