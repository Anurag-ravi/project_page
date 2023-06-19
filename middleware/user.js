const User = require('../models/user');

const auth = async (req, res, next) => {
    const api_key = req.headers.authorization;
    if(!api_key) {
        res.status(401).json({ error: 'Please Authenticate' });
    } else {
        const user = await User.findOne({ api_key });
        if(!user) {
            res.status(401).json({ error: 'User not found' });
        } else {
            req.user = user;
            next();
        }
    }
};

module.exports = auth;