const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Set a static port for the server (use port 10000 or any other port that fits your needs)
const port = 10000;

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up the storage configuration for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    // Create a unique filename using timestamp and original file extension
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Initialize multer with the storage configuration
const upload = multer({ storage });

// Define the file upload route
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  console.log(`File uploaded successfully: ${req.file.filename}`);

  // Respond with the filename of the uploaded file
  res.status(200).send(`File uploaded successfully: ${req.file.filename}`);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
