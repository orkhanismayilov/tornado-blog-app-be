import { RequestHandler } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { JWT_SECRET_KEY } from '../config';

export const authorize: RequestHandler = (req, res, next) => {
  try {
    const token = req.get('authorization').split(' ')[1];
    const { userId, email } = jwt.verify(token, JWT_SECRET_KEY) as JwtPayload;
    req.userData = { userId, email };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Authorization failed!' });
  }
};
