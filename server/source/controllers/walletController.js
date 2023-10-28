const pool = require('../connection.js');
const Moralis = require('moralis').default;
const dotenv = require('dotenv');
dotenv.config();


const connectWallet = async (req, res) => {
    
}


//HELPER FUNCTION WILL BE EXPORTED TO HELP MIDDLEWARE

const tokenAddress = 'PLACEHOLDER';
const USDTAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7';

const getWalletBalance = async (walletAddress) => {
    try {
        const returnObj = {};
        await Moralis.start({
            apiKey: process.env.MORALIS_API_KEY,
        })

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
            const balance = el.balance/(10**el.decimals);
            returnObj[el.symbol] = balance;
        });
        return returnObj;

        
        
    } catch (error) {
        console.log(error);
    }
}