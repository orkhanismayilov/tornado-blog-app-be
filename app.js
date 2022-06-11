const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const authRoutes = require('./routes/auth.route');
const postsRoutes = require('./routes/posts.route');
const { MONGO_DB_CONNECTION_STRING } = require('./config');

mongoose.connect(MONGO_DB_CONNECTION_STRING)
  .then(() => console.log('Connected to db'))
  .catch(() => console.error('Connection error!'));

const app = express();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded
app.use('/images', express.static(path.join('public/images'), { maxAge: '1d' }));

app.use((req, res, next) => {
  const protocol = req.protocol;
  const host = req.get('host');
  process.env.FULL_URL = `${protocol}://${host}`;

  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);

module.exports = app;
