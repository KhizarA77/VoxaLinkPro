const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const Moralis = require('moralis').default;
const logger = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); 

dotenv.config();

const app = express();
const server = http.createServer(app); 
const io = socketIo(server); 

// const walletRoutes = require('./routes/walletRoute.js');
const fileRoutes = require('./routes/fileRoute.js'); 

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Static route for serving downloads
// app.use('/downloads', express.static(path.join(__dirname, 'path_to_your_download_directory')));

// Setup socket.io connections
io.on('connection', (socket) => {
    console.log('a user connected:', socket.id);
    
    socket.on('disconnect', () => {
        console.log('user disconnected:', socket.id);
    });
    
    // You can define other socket events here
    // Emit events to the client as needed, for example:
    // socket.emit('fileReadyForDownload', { downloadUrl: '...' });
});

app.use((req,res,next) => {
    req.io = io;
    next();
})

// app.use('/api/wallet', walletRoutes);
app.use('/services/prescription', fileRoutes);

// Start Moralis Server
Moralis.start({
    apiKey: process.env.MORALIS_API_KEY,
}).then(() => {
    console.log("Moralis server started");

    // Start the server with HTTP server instead of the Express app
    const PORT = process.env.PORT || 4000;
    server.listen(PORT, () => {
        console.log(`Server is running on port http://localhost:${PORT}`);
    });
});

// Export 'io' to use it in other parts of the application if needed
module.exports = io;
