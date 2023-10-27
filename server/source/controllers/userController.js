const pool = require('../connection');
const jwt = require('jsonwebtoken');
const Secret = process.env.JWT_SECRET;
const axios = require('axios');
const jwksClient = require('jwks-rsa');
const { promisify } = require('util');
const { decode } = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const { log } = require('console');

const createUser = async (email, OAuthProvider) => {
    try {
        const result = await pool.query('INSERT INTO users (EMAIL, OAUTHPROVIDER) VALUES ($1, $2) RETURNING USERID', [email, OAuthProvider]);
        return result;
    }
    catch (err) {
        console.error(`Error in user creation: ${err}`);
        return null;
    }

}

const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const verifyOAuthToken = async (email, OAuthProvider, token) => {
    switch (OAuthProvider) {
        case 'Google':
            const googleResponse = await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`);
            return googleResponse.data.email.toLowerCase() === email;
        case 'Apple':
            const appleKeysResponse = await axios.get('https://appleid.apple.com/auth/keys');
            const appleKey = appleKeysResponse.data.keys.find(key => key.kid === decode(token, { complete: true }).header.kid);
            if (!appleKey) throw new Error("Apple Key ID not found.");

            const appleSigningKey = jwkToPem(appleKey);

            const appleDecodedToken = jwt.verify(token, appleSigningKey, { algorithms: ['RS256'] });
            return appleDecodedToken.email === email;
        case 'Microsoft':

            const msConfig = await axios.get('https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration');
            const msJwks = await axios.get(msConfig.data.jwks_uri);

            const msClient = jwksClient({
                jwksUri: msConfig.data.jwks_uri
            });

            const msGetSigningKey = promisify(msClient.getSigningKey);
            const msKey = await msGetSigningKey(decode(token, { complete: true }).header.kid);
            const msSigningKey = msKey.publicKey || msKey.rsaPublicKey;

            const msDecodedToken = jwt.verify(token, msSigningKey, { algorithms: ['RS256'] });
            return msDecodedToken.email === email;
        default:
            return false;
    }
}
// POST /api/users/login
exports.login = async (req, res) => {
    let { email, OAuthProvider, oauthtoken } = req.body;
    email = email.toLowerCase();
    OAuthProvider = capitalize(OAuthProvider);
    if (OAuthProvider !== 'Apple' && OAuthProvider !== 'Google' && OAuthProvider !== 'Microsoft') {
        return res.status(400).json({
            'status': 'error',
            'message': 'Invalid OAuthProvider'
        });
    }
    try {
        // const isValidToken = await verifyOAuthToken(email, OAuthProvider, oauthtoken);
        // if (!isValidToken) {
        //     return res.status(401).json({
        //         'status': 'error',
        //         'message': 'Invalid OAuthToken'
        //     });
        // }
        let user = await pool.query('SELECT USERID FROM users WHERE EMAIL = $1 AND OAUTHPROVIDER = $2', [email, OAuthProvider]);
        if (user.rows.length === 0) {
            user = await createUser(email, OAuthProvider);
            console.log(`Created new user with id ${user.rows[0].userid}`);
        }
        user = user.rows[0];
        console.log(user.userid);
        const token = jwt.sign({ userId: user.userid }, Secret, { expiresIn: '1h' });
        return res.status(200).json({
            'status': 'success',
            'message': 'User logged in successfully',
            'token': token
        });

    }
    catch (err) {
        console.error(`Error in login: ${err}`);
        return res.status(500).json({
            'status':'error',
            'message':'Internal server error try again later'
        });
    } 
}

