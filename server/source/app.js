import express from 'express';

import dotenv from 'dotenv';
import cors from 'cors';

import path from 'path'; 
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import logger from './logger.js';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

import walletRoutes from './routes/walletRoute.js';
import fileRoutes from './routes/fileRoute.js';
import contactUsRoute from './routes/contactUsRoute.js'; 


app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    const ip = req.ip;
    const userAgent = req.headers['user-agent'];
    logger.info(`Incoming request from IP: ${ip} and User Agent: ${userAgent}`);
    next();
});

// Static route for serving downloads
// app.use('/downloads', express.static(path.join(__dirname, 'path_to_your_download_directory')));


app.use('/api/wallet', walletRoutes);
app.use('/services/prescription', fileRoutes);
app.use('/api/contact', contactUsRoute);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    logger.info(`Server is running on port http://localhost:${PORT}`);
});

