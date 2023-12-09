import Web3 from 'web3';

export const verifySignatureMiddleware = (req, res, next) => {
    const { signature, nonce, walletAddress } = req.body;
    if (!signature || !nonce) {
        return res.status(400).json({ message: 'Invalid request data' });
    }
    try {
        const recoveredAddress = Web3.eth.accounts.recover(
            Web3.utils.utf8ToHex(nonce),
            signature
        );
        if (recoveredAddress.toLowerCase() === walletAddress.toLowerCase()) {
            next();
        }
        else {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            message: 'Server error during signature validation'
        });
    }
}