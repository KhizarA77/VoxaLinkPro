const express = require('express');
const Router = express.Router();

//Controllers
const { connectWallet, returnWalletBalance } = require('../controllers/walletController');

//Middlewares
const { walletInputCheck } = require('../middlewares/walletAddressInput');
const { authorize } = require('../middlewares/authMiddleware');

//Routes

// @route POST /api/wallet/connect
Router.post('/connect', walletInputCheck, connectWallet);

// @route GET /api/wallet/getBalance
// Router.get('/getBalance', authorize, returnWalletBalance);


module.exports = Router;