const Moralis = require('moralis').default;
const dotenv = require('dotenv');
dotenv.config();

const USDTAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7';
const tokenAddress = 'PLACEHOLDER'

const walletBalanceChecker = (async (req, res, next) => {
    try {
        const returnObj = {};
        // await startMoralis();
        // const { walletAddress } = req.body; 
        await Moralis.start({
            apiKey: process.env.MORALIS_API_KEY,
        })
        // if (!walletAddress) {
        //     return res.status(400).json({ error: 'Wallet address is required.' });
        // }

        const walletAddress = '0x83924Bb027ECB344bD15356Cb75900320D8F876d';

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
        if (filteredTokens.length !== 0) {

            filteredTokens.forEach(el => {
                const balance = el.balance / (10 ** el.decimals);
                returnObj[el.symbol] = balance;
            });
        }
        console.log(returnObj);
        return returnObj;


    } catch (error) {
        console.log(error);
    }
})();

// export default walletBalanceChecker;
