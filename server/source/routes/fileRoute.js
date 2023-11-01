const express = require('express');
const Router = express.Router();
const uploadMiddleware = require('../middlewares/uploadMiddleware');
const {virusScan} = require('../middlewares/virusScanMiddleware');
const { processFile } = require('../controllers/fileController');

// POST endpoint for file upload
Router.post('/upload', 
uploadMiddleware,
virusScan, 
processFile);

module.exports = Router;