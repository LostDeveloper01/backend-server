const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Initialize the app
const app = express();
const port = process.env.PORT || 3000;

// Set up the storage configuration for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Specify the folder to save uploaded files
    const uploadDir = 'uploads';
    
    // Create the folder if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Use a timestamp and the file extension as the filename
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Set up Multer middleware
const upload = multer({ storage: storage });

// Define the file upload route
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  // Respond with the filename of the uploaded file
  res.status(200).send(`File uploaded successfully: ${req.file.filename}`);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
