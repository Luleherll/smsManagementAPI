process.env.NODE_ENV = 'test';

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");
const { testHooks, signup, getToken, userAuth, agent } = require("./helpers");

const authSpec = require("./auth");
const contactsSpec = require("./contacts");
const messagesSpec = require("./messages");

const should = chai.should();
chai.use(chaiHttp);
const app = agent("http://localhost:3000/api/v1/user")
const app1 = agent("http://localhost:3000/api/v1")

describe('Specs', () => {
  testHooks()

  authSpec(app, should)
  contactsSpec(app, should)
  messagesSpec(app1, should)
});