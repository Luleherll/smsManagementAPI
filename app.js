const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const { createDbQuery, createUserTableQuery, createMessagesTableQuery } = require('./db/queries');
const { dbConnection } = require('./config');
const { createInitialQuery, execQuery } = require('./db');

const app = express();
const port = process.env.PORT || 3000;
process.env.NODE_ENV = 'test';

const { NODE_ENV } = process.env;

createInitialQuery(dbConnection, createDbQuery, 'createDb', NODE_ENV);
async function createTables() {
  return new Promise((res, rej)=> {
    createInitialQuery(dbConnection, createUserTableQuery, 'db', NODE_ENV)
    .then(res => createInitialQuery(dbConnection, createMessagesTableQuery, 'db', NODE_ENV));
  });
}
createTables();

// middleware
app.use(morgan('dev'));
app.use(bodyParser.json());

// routes
app.use('/users', require('./routes/index.js'));

app.listen(port);
console.log(`server listening at port ${port}`);
