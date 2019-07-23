const { Client } = require('pg');
const { dbConnection } = require('../config');


const { insertData } = require("./queries");
const { execQuery, dbClient, createInitialQuery } = require(".");
const { errorOcurred, onSuccess } = require("../helpers");

const users = [
  {
    user_id: 31,
    name: "admin",
    number: 1234544444,
    password: "test000000"
  },
  {
    user_id: 32,
    name: "John Tester",
    number: 435435435435,
    password: "test000000"
  },
  {
    user_id: 33,
    name: "some user",
    number: 1234567890,
    password: "test000000"
  }
];

const contacts = [
  {
    name: "tester",
    number: 435435435435,
    owner: 31,
    user_id: 32,
    id: 1
  },
  {
    name: "another",
    number: 1234567890,
    owner: 31,
    user_id: 33,
    id: 2
  }
];

const messages = [
  {
    _id: 1,
    sender: 31,
    receiver: 32,
    body: "Test message body",
    read: false
  }
];
const execSeed = async (db, data, returnValue, ENV = 'test') => {
  process.env.DB_NAME = ENV === 'test' ? 'testdb' : 'smsmanager';
  const client = new Client({ ...dbConnection(), database: 'testdb' });
  client.connect();
  await new Promise((resolve, reject) => {
    client
      .query(
        insertData(db, Object.keys(data), returnValue),
        Object.values(data)
      )
      .then(res => {
        resolve(res);
      })
      .catch(err => reject(err));
  });
};

const runSeeds = async () => {
  const fields = [
    { db: "users", data: users, returnValue: "user_id" },
    { db: "contacts", data: contacts, returnValue: "id" },
    { db: "messages", data: messages, returnValue: "_id" }
  ];
  await new Promise((resolve, reject) => {
    execSeed(fields[0].db, fields[0].data[0], fields[0].returnValue)
      .then(res =>
        execSeed(fields[0].db, fields[0].data[1], fields[0].returnValue)
      )
      .then(res =>
        execSeed(fields[0].db, fields[0].data[2], fields[0].returnValue)
      )
      .then(res =>
        execSeed(fields[1].db, fields[1].data[0], fields[1].returnValue)
      )
      .then(res =>
        execSeed(fields[1].db, fields[1].data[1], fields[1].returnValue)
      )
      .then(res =>
        execSeed(fields[2].db, fields[2].data[0], fields[2].returnValue)
      )
      .then(res => resolve(console.log('Success...')))
      .catch(err => console.error(err));
  });
};

// runSeeds();

module.exports = runSeeds;
