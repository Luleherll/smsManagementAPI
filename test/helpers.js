const chai = require("chai");
const chaiHttp = require("chai-http");

const { createInitialQuery, execQuery } = require("../db");
const { dbConnection } = require("../config");
const {
  dropMessagesTable,
  dropUserTable,
  createDbQuery,
  createMessagesTableQuery,
  createUserTableQuery
} = require("../db/queries");

async function createDatabase() {
  return new Promise((resolve, rej) => {
    createInitialQuery(dbConnection, createDbQuery, "db", "test")
      .then(res =>
        createInitialQuery(dbConnection, createUserTableQuery, "tables", "test")
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
        createInitialQuery(dbConnection, dropUserTable, "tables", "test")
      )
      .then(res => resolve())
      .catch(err => console.log(err));
  });
}

module.exports = {
  testHooks: () => {
    before(async () => {
      await createDatabase();
    });
    after(async () => {
      await dropTables();
    });
  },
  signup: (data, done) => {
    chai
        .request("http://localhost:3000/users")
        .post("/signup")
        .send(data)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("error");
          done();
        });
  }
};
