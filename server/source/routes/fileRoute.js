const express = require('express');
const Router = express.Router();
const uploadMiddleware = require('../middlewares/uploadMiddleware');
const {virusScan} = require('../middlewares/virusScanMiddleware');
const { processFile, downloadFile, transcriptionHistory } = require('../controllers/fileController');
const { authorize } = require('../middlewares/authMiddleware');
const {walletBalanceChecker} = require('../middlewares/walletBalanceChecker');

// POST endpoint for file upload
Router.post('/upload',
// authorize,
// walletBalanceChecker,
uploadMiddleware,
virusScan, 
processFile);

Router.get('/history', authorize, transcriptionHistory);


Router.get('/download', downloadFile)

module.exports = Router;