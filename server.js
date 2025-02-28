const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

// Use dynamic port for Render deployment, default to 10000 for local development
const port = process.env.PORT || 10000;

// Set up the storage configuration for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads'; // Define the directory where files will be saved
    
    // Create the uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true }); // Ensure the parent directory is created if needed
    }

    // Set the destination folder for uploads
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create a unique filename using timestamp and original file extension
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

// Define the file upload route
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // Log the uploaded file's name
  console.log(`File uploaded successfully: ${req.file.filename}`);
  
  // Respond with the filename of the uploaded file
  res.status(200).send(`File uploaded successfully: ${req.file.filename}`);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
