const jwt = require('jsonwebtoken');
const Secret = process.env.JWT_SECRET;

exports.authorize = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        console.log(`No token provided`);
        return res.status(401).json({
            'status': 'error',
            'message': 'Unauthorized'
        });
    }
    jwt.verify(token, Secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                'status': 'error', 
                'message': 'Please login again / Session expired'
            });
        }
        req.user=decoded;
        next();
    });
}