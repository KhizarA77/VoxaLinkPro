// // uploadMiddleware.js

// import multer from 'multer';

// import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';

// import multers3 from 'multer-s3';

// import path from 'path'

// import { v4 as uuidv4 } from 'uuid'

// import logger from '../logger.js'


// const s3 = new S3Client();


// // const storage = multers3({
// //   s3: s3,
// //   bucket: 
// // })


// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, '../Files/uploads'); // Adjust the path as needed
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = `${uuidv4()}${path.extname(file.originalname)}`;
//     logger.info(`File name: ${uniqueSuffix}`);
//     cb(null, uniqueSuffix);
//   }
// });

// const uploadMiddleware = multer({
//   storage: storage,
//   limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit
//   fileFilter: (req, file, cb) => {
//     const filetypes = /wav|ogg|m4a|mp3|mov|mpeg|mp4|avi|opus|aac|flac|m4v/;
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = filetypes.test(file.mimetype);
//     if (mimetype && extname) {
//       logger.info(`FILE UPLOADED`);
//       return cb(null,true);
//     }
//     else {
//       cb(new Error('Error: File type not supported'), false)
//     }
//   }
// }).single('file');

// export default uploadMiddleware;