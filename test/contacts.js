const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");
const { testHooks, signup, userAuth, agent } = require("./helpers");

const should = chai.should();
chai.use(chaiHttp);
const app = agent("http://localhost:3000/api/v1/user");

describe("API", () => {
  testHooks();

  describe("Contacts", () => {
    let authUser;
    before(async () => {
      await userAuth(
        {
          name: 'testuser',
          phoneNumber: 123456789,
          password: "testpassword"
        },
        "/signup"
      );
      authUser = await userAuth(
        {
          phoneNumber: 123456789,
          password: "testpassword"
        },
        "/signin"
      );
    });
    describe("/GET contacts", () => {
      it("returns all user contacts", done => {
        app
          .get("/contacts")
          .set("Authorization", `Bearer ${authUser.body.token}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            done();
          });
      });
    });

    describe("/POST contacts", () => {
      it("creates a contact", done => {
        app
        .post("/contacts")
        .send({
          name: "admin",
          phoneNumber: 1234544444})
          .set("Authorization", `Bearer ${authUser.body.token}`)
          .end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.a("object");
            done();
          });
      });
    });

    describe("/PUT contacts", () => {
      it("updates a contact", done => {
        app
        .put(`/contacts/${authUser.body.user.user_id}`)
        .send({
          name: "test",
          phoneNumber: 1234544444})
          .set("Authorization", `Bearer ${authUser.body.token}`)
          .end((err, res) => {
            console.log(res.body);
            res.should.have.status(200);
            res.body.should.be.a("object");
            done();
          });
      });
    });

    describe("/DELETE contacts", () => {
      it("deletes a contact", done => {
        app
        .delete(`/contacts/${authUser.body.user.user_id}`)
          .set("Authorization", `Bearer ${authUser.body.token}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            done();
          });
      });
    });
  });
});
