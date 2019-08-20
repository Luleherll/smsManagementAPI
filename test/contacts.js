const { userAuth} = require("./helpers");

module.exports = (app, should) => describe("API", () => {
  describe("Contacts", () => {
    let authUser;
    before(async () => {
      authUser = await userAuth(
        {
          phoneNumber: 1234544444,
          password: "test000000"
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
          name: "some",
          phoneNumber: 1234567890})
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
        .put(`/contacts/1`)
        .send({
          name: "testing",
          phoneNumber: 1234567890})
          .set("Authorization", `Bearer ${authUser.body.token}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            done();
          });
      });
    });

    describe("/DELETE contacts", () => {
      it("deletes a contact", done => {
        app
        .delete(`/contacts/1`)
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
