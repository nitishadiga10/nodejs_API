const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    try {
        const token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['Authorization'] || req.headers['authorization'];
        const token_final = token.split(" ")[1];
        console.log('check auth token', token_final);

        const decoded = jwt.verify(token_final, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    } catch (error) {
        console.log('auth error', error);
        return res.status(401).json({
            message:
                "auth failed"
        })
    }
}