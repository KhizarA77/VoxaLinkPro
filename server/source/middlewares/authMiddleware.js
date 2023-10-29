const jwt = require('jsonwebtoken');

exports.authorize = (req,res,next) => {
    const token = req.headers.authorization;
    if (!token) {
        console.log(`Authorization middleware: no token in request headers`)
        return res.status(401).json({
            'message': 'Authorization failed'
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.Wallet = decoded;
        console.log(`Authorization middleware: JWT verified successfully, wallet address: ${req.Wallet.walletAddress}`)
        next();
    }
    catch (error) {
        console.error(`Error in verifying JWT. \nError: \n${error}`);
        return res.status(401).json({
            'message': 'Unauthorized: Invalid token'
        });
    }
}