const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require('../config');
const User = require('../models/user.model');

class AuthController {

  async signup(req, res) {
    const { firstName, lastName, email, password } = req.body;

    if (!(firstName && lastName && email && password)) {
      return res.status('400').json({ message: 'Invalid user data' });
    }

    const user = new User({
      firstName,
      lastName,
      email,
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    try {
      await user.save();
      res.json(null);
    } catch (err) {
      res.status(400).json({ message: err.errors.email.message });
    }
  };

  async login(req, res) {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isAuthorized = await bcrypt.compare(password, user.password);
    if (!isAuthorized) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const tokenData = {
      userId: user.id,
      email: user.email,
      nonce: Date.now(),
    };
    const token = jwt.sign(tokenData, JWT_SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({
      user,
      token,
      expiresIn: 3600,
    });
  };

}

module.exports = new AuthController();
