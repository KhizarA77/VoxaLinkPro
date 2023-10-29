exports.walletInputCheck = (req,res,next) => {
    const {walletAddress} = req.body;
    if (!walletAddress) {
        console.log(`Wallet address input middleware: no wallet address in request body`)
        return res.status(400).json({
            'message': 'Wallet address not provided in request body from front-end'
        });
    }
    next();
}