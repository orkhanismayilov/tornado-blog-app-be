import bcrypt from 'bcrypt';
import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

import { TBA_JWT_SECRET_KEY } from '../config';
import { UserModel } from '../models';

export class AuthController {
  static signup: RequestHandler = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if (!(firstName && lastName && email && password)) {
      return res.status(400).json({ message: 'Invalid user data' });
    }

    const user = new UserModel({
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

  static login: RequestHandler = async (req, res) => {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = await UserModel.findOne({ email });
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
    const token = jwt.sign(tokenData, TBA_JWT_SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({
      user,
      token,
      expiresIn: 3600,
    });
  };
}
