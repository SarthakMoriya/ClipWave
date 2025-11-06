const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "_" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// 📤 Handle file upload
router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ status: "error", message: "No file uploaded" });
  }

  const fileUrl = `http://${req.headers.host}/uploads/${req.file.filename}`;
  res.json({
    status: "success",
    message: "File uploaded successfully",
    file: {
      name: req.file.filename,
      url: fileUrl,
    },
  });
});

module.exports = router;
