exports.loginValidation = (req, res, next) => {
    const {email, OAuthProvider, oauthtoken} = req.body;
    if(!email || !OAuthProvider){ // || !oauthtoken){
        console.error(`Error in loginvalidation middleware: Missing required fields`);
        return res.status(400).json({
            'status':'error',
            'message':'Missing required fields'
        });
    }
    next();
}

