const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const authRouter = require('./auth/auth-router');
const jokesRouter = require('./jokes/jokes-router');

const server = express();

server.use(express.json());
server.use(helmet());
server.use(cors());

server.use('/api/auth', authRouter);
server.use('/api/jokes', jokesRouter);

server.get('/', (req, res) => {
  res.json({ api: 'up' });
});

module.exports = server;
