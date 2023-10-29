const pool = require('../connection.js');
const Moralis = require('moralis').default;
const dotenv = require('dotenv');
// const  ethers  = require('ethers');
const { utils } = require('ethers');
const jwt = require('jsonwebtoken');
dotenv.config();



exports.connectWallet = async (req, res) => {
    const { walletAddress, signature, message } = req.body;
    try {
        // Check if wallet address is already in database
        const walletExists = await checkWalletExistence(walletAddress);
        const WA = walletAddress;
        if (!walletExists) {
            if (!signature || !message) {
                return res.status(400).json({
                    'message': 'Signature or message not provided in request body from front-end'
                });
            }
            // Verify signature
            
            const recoveredAddress = utils.verifyMessage(message, signature);
            if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
                return res.status(401).json({
                    'message': 'Signature verification failed'
                });
            }
            // Store wallet address in database
            await pool.query(`INSERT INTO WALLETS (wallet_address) VALUES ($1)`, [WA]);
            console.log(`Wallet address ${WA} stored in database`);
        }
        else if (walletExists && signature && message) {
            // Verify signature
            const recoveredAddress = utils.verifyMessage(message, signature);
            if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
                return res.status(401).json({
                    'message': 'Signature verification failed'
                });
            }
        }
        // Create JWT
        const token = jwt.sign({ 'walletAddress':WA }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log(`JWT created successfully`);
        // Get wallet balance
        const walletBalance = await getWalletBalance(WA);
        console.log(`Wallet balance returned successfully`);
        // Send response
        return res.status(200).json({
            'message': 'Wallet connected successfully',
            'token': token,
            'walletBalance': walletBalance
        });
    }
    // If an error is thrown make sure the user is prompted to connect the wallet again on the front end
    catch (error) {
        console.error(`Error in storing wallet address to database. \nError: \n${error}`);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

exports.returnWalletBalance = async (req, res) => {
    const { walletAddress } = req.Wallet;
    try {
        const walletBalance = await getWalletBalance(walletAddress);
        return res.status(200).json({
            'message': 'Wallet balance returned successfully',
            'walletBalance': walletBalance
        });
    }
    catch(err) {
        console.error(`Error in returning wallet balance: ${err}`);
        return res.status(500).json({
            message: 'Internal server error. Report to devs'
        })
    }
}

// HELPER FUNCTION WILL BE EXPORTED TO HELP MIDDLEWARE

const tokenAddress = 'PLACEHOLDER';
const USDTAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7';

const getWalletBalance = async (walletAddress) => {
    try {
        const returnObj = {};
        const ethBalance = await Moralis.EvmApi.balance.getNativeBalance({
            address: walletAddress,
            chain: '0x1'
        });
        const eth = ethBalance.result.balance.ether;

        const tokenBalances = await Moralis.EvmApi.token.getWalletTokenBalances({
            address: walletAddress,
            chain: '0x1'
        });
        const tokens = tokenBalances.toJSON()
        const filteredTokens = tokens.filter((el) => el.token_address === tokenAddress || el.token_address === USDTAddress);
        if (filteredTokens.length === 0 && !eth) {
            return null;
        }
        if (eth) {
            returnObj['ETH'] = eth;
        }
        filteredTokens.forEach(el => {
            const balance = el.balance / (10 ** el.decimals);
            returnObj[el.symbol] = balance;
        });
        return returnObj;

    } catch (error) {
        console.log(error);
    }
}


const checkWalletExistence = async (walletAddress) => {
    try {
        const result = await pool.query(`SELECT * FROM WALLETS WHERE wallet_address = $1`, [walletAddress]);
        if (result.rows.length === 0) {
            return false;
        }
        return true;
    } catch (error) {
        console.error(`Error in checking if wallet exists in database. \nError: \n${error}`);
        return false;
    }
}



