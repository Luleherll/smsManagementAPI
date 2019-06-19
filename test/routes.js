process.env.NODE_ENV = "test";

const nock = require("nock");

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");
const { testHooks, signup } = require("./helpers");

const should = chai.should();
chai.use(chaiHttp);

describe("User authentication", () => {
  testHooks();
  describe("/POST signup", () => {
    [
      {},
      {
        name: "atest",
        phoneNumber: "string number",
        password: "testpassword"
      }
    ].forEach(data => {
      it('should validate data', (done) => {
        signup(data, done);
      });
    })

    it("should be successful", done => {
      chai
        .request("http://localhost:3000/users")
        .post("/signup")
        .send({
          name: "admin",
          phoneNumber: 1234544444,
          password: "test000000"
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.should.have.property("message");
          done();
        });
    });

    it("should not register user more than once", done => {
      const data = {
        name: "atest",
        phoneNumber: 123456789,
        password: "testpassword"
      };
      chai
        .request("http://localhost:3000/users")
        .post("/signup")
        .send(data)
        .end((err, res) => {
          chai
            .request("http://localhost:3000/users")
            .post("/signup")
            .send(data)
            .end((err, res) => {
              res.should.have.status(403);
              res.body.should.be.a("object");
              res.body.should.have.property("error");
              done();
            });
        });
    });
  });

  describe("/POST signin", () => {
    it("should be successful", done => {
      chai
        .request("http://localhost:3000/users")
        .post("/signin")
        .send({
          phoneNumber: 123456789,
          password: "testpassword"
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("token");
          done();
        });
    });

    it("should be unsuccessful for unregistered user", done => {
      chai
        .request("http://localhost:3000/users")
        .post("/signin")
        .send({
          phoneNumber: 1236789,
          password: "testpassword"
        })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a("object");
          res.body.should.have.property("error");
          done();
        });
    });
  });
});
