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

Router.get('/test', authorize, (req, res) => {
    console.log(`hellowoewo`);
    res.status(200).json({'message': 'hello world'});
})

// @route GET /api/wallet/getBalance
// Router.get('/getBalance', authorize, returnWalletBalance);


module.exports = Router;