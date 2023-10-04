const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Access Denied');

    try {
        const decode = jwt.verify(token, 'mySecureKey'); // config.get('jwtPrivateKey')
        req.user = decode
        next()
    } catch (error) {
        res.status(401).send('Invalid Token')
    }
}

module.exports = auth