// import express from 'express';
// import Moralis from 'moralis';
// import dotenv from 'dotenv';
// import cors from 'cors';

const express = require('express');
const Moralis = require('moralis').default;
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello World!');
})


Moralis.start({
    apiKey: process.env.MORALIS_API_KEY,
}).then(() => {
    console.log("Moralis server started");
    app.listen(process.env.PORT || 4000, ()=> {
        console.log(`Server is running on port http://localhost:${process.env.PORT || 4000}`);
    });
})