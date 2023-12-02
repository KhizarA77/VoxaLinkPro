import express from 'express' 
const Router = express.Router();

//Controllers
import { connectWallet } from '../controllers/walletController.js';

//Middlewares
import { walletInputCheck } from '../middlewares/walletAddressInput.js';

//Routes

// @route POST /api/wallet/connect
Router.post('/connect', walletInputCheck, connectWallet);



export default Router;