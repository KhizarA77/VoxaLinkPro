const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { sendEmail } = require('./emailSender.js');
const pool = require('../connection.js');


const OUTPUT_FILES_DIR = path.join(__dirname, '../../..', 'Files', 'outputs');

const processFile = async (req, res) => {
  const socket = req.io;
  const file = req.file;
  const fileName = file.filename;
  // const { walletAddress } = req.Wallet;
  let fname = fileName.split('.')[0];
  fname = fname + '.' + req.body.outputFormat;
  console.log(fname);

  try {
    // Emit the upload status to the client via WebSocket
    socket.emit('upload status', { status: 'File uploaded, starting virus scan...' });

    // Virus scan middleware has already run if this point is reached

    // Emit the status of the virus scan
    socket.emit('upload status', { status: 'File is clean, processing...' });

    // Call the Python API
    const response = await axios.post(`http://localhost:5000/transcribe`, //x.pdf/docx/html
    {
      'fileName': fileName,
      'outputFormat': req.body.outputFormat, //{'pdf', 'docx', 'html'}

    });
    // Insert into database
    // await pool.query(`INSERT INTO TRANSCRIPTIONS (wallet_address, transcribed_file_name, transcription_time) 
    // VALUES ($1, $2, $3)`, [walletAddress, response.data.fileName, new Date()]);

    // Generate download link
    const downloadLink = `http://localhost:4000/services/prescriptions/download?file=${encodeURIComponent(fname)}`;
    if (req.body.email) {
      await sendEmail(req.body.email, downloadLink);
  }

    // Delete the original uploaded file
    fs.unlinkSync(file.path);

    // Send a response with the download link
    return res.status(200).json({
      'status': 'success',
      'message': 'Link sent to email',
      'downloadLink': downloadLink 
      });

  } catch (error) {
    console.error('Error processing file:', error);
    socket.emit('upload status', { status: 'An error occurred during file processing', error: error.message });
    return res.status(500).json({
      'status': 'error',
      'message':'An error occurred during file processing'});
  }
};

const downloadFile = async (req, res) => {
  const requestedFileName = req.query.file;
  if (!requestedFileName) {
    return res.status(400).json({
      'status': 'error',
      'message':'No file specified'
    });
  }

  try {
    // Decode and sanitize the input to prevent directory traversal
    const safeFileName = path.basename(decodeURIComponent(requestedFileName));

    // Construct the full file path
    const filePath = path.join(OUTPUT_FILES_DIR, safeFileName);

    // Check if the file exists and is a file, not a directory
    if (!fs.existsSync(filePath) || !fs.lstatSync(filePath).isFile()) {
      return res.status(404).json({
        'status': 'error',
        'message':'File not found'
      });
    }

    // Send the file
    return res.download(filePath, safeFileName, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        return res.status(500).json({
          'status': 'error',
          'message':'An error occurred during file processing'});
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(400).json({
      'status': 'error',
      'message':'Invalid request'
    });
  }
};


const transcriptionHistory = async (req,res) => {
  const { walletAddress } = req.Wallet;
  try {
    const result = await pool.query(`SELECT transcribed_file_name, transcription_time FROM TRANSCRIPTIONS WHERE wallet_address = $1`, [walletAddress]);
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error retrieving transcription history:', error);
    return res.status(500).send('An error occurred while retrieving transcription history');
  }
}



module.exports = { processFile, downloadFile, transcriptionHistory };
