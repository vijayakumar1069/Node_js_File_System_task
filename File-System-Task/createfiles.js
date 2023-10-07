const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Define the route to create the text file
app.get('/createTextFile', (req, res) => {
  try {
    // Get the current timestamp
    const currentTimestamp = new Date().getTime();

    // Format the current date-time
    const currentDate = new Date().toISOString().replace(/:/g, '-');
    
    // Create the file content (current timestamp)
    const fileContent = currentTimestamp.toString();

    // Define the file name using the current date-time
    const fileName = `${currentDate}.txt`;

    // Define the folder path where the file will be saved
    const folderPath =  "./newfolder"

    // Create the file path
    const filePath = path.join(folderPath, fileName);

    // Write the content to the file
    fs.writeFileSync(filePath, fileContent);

    // Respond with a success message
    res.status(200).json({ message: 'Text file created successfully' });
  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating the text file' });
  }
});

const folderPath = path.join(__dirname, "./newfolder"); 
app.get('/gettingfiles', (req, res) => {
  try {
    // Read the files in the folder
    const files = fs.readdirSync(folderPath);

    // Respond with the list of files
    res.json({ files });
  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).json({ error: 'An error occurred while listing files' });
  }
});

// API endpoint to serve individual files
app.get('/gettingfiles/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(folderPath, filename);

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // Stream the file to the response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } else {
    // File not found
    res.status(404).json({ error: 'File not found' });
  }
});

// Start the server
const port = 3000; // Change this to your desired port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
