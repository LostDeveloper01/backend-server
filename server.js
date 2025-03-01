const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data'); // Import form-data
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

// Discord webhook URL
const discordWebhookUrl = 'https://discord.com/api/webhooks/1345198000909062197/TOeKkaWCyPs6We8mB0P3NsqHmOZ9zALqHJc1mXKubWGeJmiftvh8YS8iPXbxFbVqlpWx';

// Define the file upload route
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // Log the uploaded file's name
  console.log(`File uploaded successfully: ${req.file.filename}`);
  
  // Create a new FormData object to send the file to Discord
  const formData = new FormData();
  formData.append('file', fs.createReadStream(path.join(__dirname, 'uploads', req.file.filename)));
  
  try {
    // Send the file to Discord using the webhook
    await axios.post(discordWebhookUrl, formData, {
      headers: {
        ...formData.getHeaders() // This should now work correctly with form-data
      }
    });

    console.log('File sent to Discord successfully!');
  } catch (error) {
    console.error('Error sending file to Discord:', error);
  }

  // Respond with the filename of the uploaded file
  res.status(200).send(`File uploaded and sent to Discord successfully: ${req.file.filename}`);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
