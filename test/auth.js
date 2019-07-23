const { signup } = require("./helpers");

module.exports = (app, should) =>
  describe("User authentication", () => {
    describe("/POST signup", () => {
      [
        {},
        {
          name: "atest",
          phoneNumber: "string number",
          password: "testpassword"
        }
      ].forEach(data => {
        it("should validate data", done => {
          signup(data, done);
        });
      });

      it("should be successful", done => {
        app
          .post("/signup")
          .send({
            name: "some admin",
            phoneNumber: 12345696988,
            password: "test000000"
          })
          .end((err, res) => {
            console.log("kkkk", res.body);
            console.log("jjjj", res.body);
            res.should.have.status(201);
            res.body.should.be.a("object");
            res.body.should.have.property("message");
            done();
          });
      });

      it("should not register user more than once", done => {
        const data = {
          name: "admin",
          phoneNumber: 1234544444,
          password: "test000000"
        };
        app.post("/signup").send(data).end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a("object");
          res.body.should.have.property("error");
          done();
        });
      });
    });

    describe("/POST signin", async () => {
      it("should be successful", done => {
        app
          .post("/signin")
          .send({
            phoneNumber: 1234544444,
            password: "test000000"
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("token");
            done();
          });
      });

      it("should be unsuccessful for unregistered user", done => {
        app
          .post("/signin")
          .send({
            phoneNumber: 123678990949,
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
