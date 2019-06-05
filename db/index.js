const { Pool, Client } = require('pg');
const connectionString = 'postgressql://postgres:0789@localhost:5432/smsmanager';

const client = new Client({ connectionString }).connect();

module.exports = client;