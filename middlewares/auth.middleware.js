const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require('../config');

module.exports = (req, res, next) => {
  try {
    const token = req.get('authorization').split(' ')[1];
    const { userId, email } = jwt.verify(token, JWT_SECRET_KEY);
    req.userData = { userId, email };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Authorization failed!' });
  }
};