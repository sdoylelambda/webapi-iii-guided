const express = require('express'); // importing a CommonJS module
// step 1 yarn install helmet and import
const helmet = require('helmet');
// step 3 yarn add morgan and import
const morgan = require('morgan');

// step 5 -- custom middleware
function methodLogger() {
  return (req, res, next) => {
  console.log(`${req.method} Request`);
  next();
  }
}

// step 7 -- custom middleware2
function addName(req, res, next) {
  req.name = 'Cassandra';
  next();
}

// step 9
function checkName(req, res, next) {
  if(req.name === 'Cassandra') {
    next()
  } else {
    res.status(403).send('Wrong Name')
  }
}

// step 10 custom middleware3
// Write middleware that returns 403 status and the message 'you shall 
// not pass' when the seconds of the current time are multiples of 3, 
// else call next.
function noPass(req, res, next) {
  const seconds = new Date().getSeconds();
  if(seconds % 3 === 0) {
    next()
  } else {
    res.status(403).send('you shall not pass')
  }
}

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();
// step 2
server.use(helmet());
// step 4 
server.use(morgan('dev')); // almost always dev option
// step 6
server.use(methodLogger());
// step 8

server.use(noPass);
server.use(addName);

server.use(express.json());

server.use('/api/hubs', hubsRouter);

server.get('/', checkName, (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

module.exports = server;
