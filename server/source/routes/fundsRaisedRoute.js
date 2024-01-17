import express from 'express';
const Router = express.Router();


import { getFundsRaised } from '../utils/getTokenBalance.js';

Router.get('/', async (req, res) => {
    const fundsRaised = await getFundsRaised();
    res.json({fundsRaised})
})

export default Router;