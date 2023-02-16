import chalk from 'chalk';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';

import { MONGO_DB_CONNECTION_STRING } from './config';
import { authRoutes, postsRoutes } from './routes';

mongoose
  .connect(MONGO_DB_CONNECTION_STRING)
  .then(() => console.log(chalk.greenBright('Connected to MongoDB')))
  .catch(() => console.warn(chalk.redBright('Connection error!')));

export const app = express();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded
app.use(
  '/images',
  express.static(path.join('../../public/images'), { maxAge: '1d' }),
);

app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://tornado.3031303.xyz');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS',
  );
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
