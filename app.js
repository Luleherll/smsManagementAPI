const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const { createDbQuery, createUserTableQuery, createMessagesTableQuery, dropDB } = require('./db/queries');
const { dbConnection } = require('./config');
const { createInitialQuery, execQuery } = require('./db');

const app = express();
const port = process.env.PORT || 3000;
process.env.NODE_ENV = 'development';

const { NODE_ENV } = process.env;

async function createDatabase(NODE_ENV) {
  await new Promise((res, rej)=> {
    createInitialQuery(dbConnection, createDbQuery, 'db', NODE_ENV)
    .then(res => createInitialQuery(dbConnection, createUserTableQuery, 'tables', NODE_ENV))
    .then(res => createInitialQuery(dbConnection, createMessagesTableQuery, 'tables', NODE_ENV))
    .catch(err => console.log(err))
  });
}
createDatabase(NODE_ENV);

// middleware
app.use(morgan('dev'));
app.use(bodyParser.json());

// routes
app.use('/api/v1/', require('./routes'));

app.listen(port);
console.log(`server listening at port ${port}`);
