const Moralis = require('moralis').default;
const { getWalletBalance } = require('../controllers/walletController');
const pool = require('../connection.js');
// const dotenv = require('dotenv');
// dotenv.config();

const token_threshold = 160000;

exports.walletBalanceChecker = async (req, res, next) => {
    const { walletAddress } = req.Wallet;
    try {
        const result = await pool.query(`SELECT last_usage_time, usage_count FROM WALLETS WHERE wallet_address = $1`, [walletAddress]);
        let lastUsageTime = result.rows[0].last_usage_time;
        let usageCount = result.rows[0].usage_count;
        const walletBalance = await getWalletBalance(walletAddress);
        const noOfTokens = Number(walletBalance['VLKC']);

        if (Date.now() - lastUsageTime > 86400000) {
            lastUsageTime = Date.now();
            usageCount = 0;
        }
        // Two Cases
        if (noOfTokens < token_threshold) {
            if (usageCount >= 3) {
                console.log(`Wallet ${walletAddress} has insufficient tokens and has exceeded usage count`);
                return res.status(400).json({
                    'message': 'Insufficient tokens and exceeded usage count for the day'
                });
            }
            usageCount++;
            lastUsageTime = Date.now();
            await pool.query(`UPDATE WALLETS SET last_usage_time = $1, usage_count = $2 WHERE wallet_address = $3`, [lastUsageTime, usageCount, walletAddress]);
            console.log(`Passed through walletbalance middleware. Wallet ${walletAddress} has tokens less than  threshold but free uses left`);
            next();
        }
        else {
            if (usageCount >= 15) {
                console.log(`Wallet ${walletAddress} has sufficient tokens but has exceeded usage count`);
                return res.status(400).json({
                    'message': 'Sufficient tokens but exceeded usage count for the day'
                });
            }
            usageCount++;
            lastUsageTime = Date.now();
            await pool.query(`UPDATE WALLETS SET last_usage_time = $1, usage_count = $2 WHERE wallet_address = $3`, [lastUsageTime, usageCount, walletAddress]);
            console.log(`Passed through walletbalance middleware. Wallet ${walletAddress} has sufficient tokens and free uses left`);
            next();
        }
    }
    catch (err) {
        console.error(`Error in walletBalanceChecker middleware: ${err}`);
        return res.status(500).json({
            'message': 'Server sided error, cant obtain wallet balance'
        });
    }
};