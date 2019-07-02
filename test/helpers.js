const chai = require("chai");
const chaiHttp = require("chai-http");

const { createInitialQuery, execQuery } = require("../db");
const { dbConnection } = require("../config");
const {
  dropMessagesTable,
  dropUserTable,
  dropContactsTable,
  createDbQuery,
  createMessagesTableQuery,
  createContactsTableQuery,
  createUserTableQuery
} = require("../db/queries");

async function createDatabase() {
  return new Promise((resolve, rej) => {

        createInitialQuery(dbConnection, createUserTableQuery, "tables", "test")
      .then(res =>
        createInitialQuery(
          dbConnection,
          createContactsTableQuery,
          "tables",
          "test"
        )
      )
      .then(res => {
        createInitialQuery(
          dbConnection,
          createMessagesTableQuery,
          "tables",
          "test"
        );
        resolve();
      })
      .catch(err => console.log(err));
  });
}
async function dropTables() {
  return new Promise((resolve, rej) => {
    createInitialQuery(dbConnection, dropMessagesTable, "tables", "test")
      .then(res =>
        createInitialQuery(dbConnection, dropContactsTable, "tables", "test")
      )
      .then(res =>
        createInitialQuery(dbConnection, dropUserTable, "tables", "test")
      )
      .then(res => resolve())
      .catch(err => console.log(err));
  });
}

module.exports = {
  signup: (data, done) => {
    chai
      .request("http://localhost:3000/api/v1/user")
      .post("/signup")
      .send(data)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        done();
      });
  },
  agent: (path) => chai.request(path),
  userAuth: async(user, endpoint) => {
    const response = await new Promise((resolve, reject) => {
      chai
      .request("http://localhost:3000/api/v1/user")
      .post(endpoint)
      .send(user)
      .end((err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(res);
      });
    })
    return response
  },
    testHooks: () => {
      before(async () => {
        await createDatabase();
      });
      after(async () => {
        await dropTables();
      });
    }
};
