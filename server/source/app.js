const express = require('express');

const Moralis = require('moralis').default;
const dotenv = require('dotenv');
const cors = require('cors');

const path = require('path'); 
const cookieParser = require('cookie-parser');
const logger = require('./logger');


dotenv.config();

const app = express();

const walletRoutes = require('./routes/walletRoute.js');
const fileRoutes = require('./routes/fileRoute.js');
const contactUsRoute = require('./routes/contactUsRoute.js'); 

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


// Start Moralis Server
Moralis.start({
    apiKey: process.env.MORALIS_API_KEY,
}).then(() => {
    console.log("Moralis server started");

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        logger.info(`Server is running on port http://localhost:${PORT}`);
    });
});
