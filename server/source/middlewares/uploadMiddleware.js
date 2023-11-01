// uploadMiddleware.js

const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Adjust the path as needed
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueSuffix);
  }
});

const uploadMiddleware = multer({
  storage: storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /wav|ogg|m4a|mp3|wmv|mov|mpeg|mp4/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      console.log(`FILE UPLOADED`);
      return cb(null,true);
    }
    else {
      cb(new Error('Error: File type not supported'), false)
    }
  }
}).single('file');

module.exports = uploadMiddleware;