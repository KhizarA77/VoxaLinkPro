const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const pool = require('../connection');

const storage = multer.diskStorage({
    destination
})