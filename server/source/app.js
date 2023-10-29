const express = require('express');
const Moralis = require('moralis').default;
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const walletRoutes = require('./routes/walletRoute.js');

app.use(cors());

app.use(express.json());

app.use('/api/wallet', walletRoutes);  

Moralis.start({
    apiKey: process.env.MORALIS_API_KEY,
}).then(() => {
    console.log("Moralis server started");
    app.listen(process.env.PORT || 4000, ()=> {
        console.log(`Server is running on port http://localhost:${process.env.PORT || 4000}`);
    });
})