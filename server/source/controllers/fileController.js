// controllers/fileController.js

const axios = require('axios');
const fs = require('fs');
const util = require('util');


const processFile = async (req, res) => {
  const socket = req.io;
  const file = req.file;
  console.log('File uploaded:', file);
  try {
    // Emit the upload status to the client via WebSocket
    socket.emit('upload status', { status: 'File uploaded, starting virus scan...' });

    // Virus scan middleware has already run if this point is reached

    // Emit the status of the virus scan
    socket.emit('upload status', { status: 'File is clean, processing...' });

    // Call the Python API
    // const response = await axios.get(`http://localhost:2000/Model/getPrescription`, {
    //   params: {
    //     filePath: file.path,
    //     outputFormat: req.body.outputFormat,
    //   }
    // });

    // if (response.headers['content-type'] === 'text/plain') {
    //     // Send the text to the client
    //     res.status(200).send(response.data);
    //   } else {
    //     // Send the file to the client for download
    //     const filePath = response.data.filePath;
    //     res.download(filePath, (err) => {
    //       if (err) {
    //         console.error('Error sending file:', err);
    //       }
    //       // Delete the file after it has been sent
    //       fs.unlink(filePath, (err) => {
    //         if (err) {
    //           console.error('Error deleting file:', err);
    //         }
    //       });
    //     });
    //   }
  
      // Delete the original uploaded file
      fs.unlinkSync(file.path);
  
      // Emit the status of the file processing
      socket.emit('upload status', { status: 'Processing complete' });

  } catch (error) {
    console.error('Error processing file:', error);
    socket.emit('upload status', { status: 'An error occurred during file processing', error: error.message });
    res.status(500).send('An error occurred during file processing');
  }
};

module.exports = {processFile}