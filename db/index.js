const { Pool, Client } = require('pg');
const pgtools = require('pgtools');
const { ADMIN_DB, dbConnection } = require('../config');

async function createInitialQuery(dbConnection, query, type, ENV) {
  process.env.DB_NAME = ENV === 'test' ? 'testdb' : 'smsmanager';
  const newQuery = query(process.env.DB_NAME);
  const client = new Client({ ...dbConnection(), database: type === 'db' ? ADMIN_DB : process.env.DB_NAME });
  client.connect();
  await new Promise((resolve, reject) => {
    client.query(newQuery)
    .then(res => {
      resolve(res);
    })
    .catch(err => reject(err));
  });
}

const dbClient = () => new Pool(dbConnection());

async function execQuery(query, paramsArray, res, onSuccess, errorOcurred) {
  return await new Promise((resolve, reject) => {
    dbClient().query(query, paramsArray)
    .then((response) => onSuccess(response))
    .catch(err => errorOcurred(err, res));
  });
}

async function dataLookup(dbname, fieldsArray, valuesArray ) {
  let fields = "";
  fieldsArray.forEach(
      (field, index) => (fields += ` AND ${field} = $${index + 1}`)
    );
  const query = `SELECT * FROM ${dbname} WHERE ${fields.slice(4)}`
  const result = await dbClient().query(query, valuesArray)
    .then((response) => response.rows)
    .catch(err => console.error(err));
  return result;
}

module.exports = { dbClient, createInitialQuery, execQuery, dataLookup };
