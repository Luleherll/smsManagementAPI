const { userAuth } = require("./helpers");

module.exports = (app, should) => describe("API", () => {
  describe("Messages", () => {
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

    describe("/POST /:name/send", () => {
      it("sends a message", done => {
        app
        .post("/another/send")
        .send({message: 'Test message'})
          .set("Authorization", `Bearer ${authUser.body.token}`)
          .end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.a("object");
            done();
          });
      });
    });

    describe("/GET conversation", () => {
      it("returns user's messaging history with a contact", done => {
        app
          .get("/another/conversation")
          .set("Authorization", `Bearer ${authUser.body.token}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.data.should.have.property("to");
            res.body.data.should.have.property("from");
            done();
          });
      });

      it("checks the url", done => {
        app
          .get("/another/not-url")
          .set("Authorization", `Bearer ${authUser.body.token}`)
          .end((err, res) => {
            res.should.have.status(404);
            done();
          });
      });
    });

    describe("/GET message", () => {
      it("returns a message", done => {
        app
        .get(`/another/to/1`)
          .set("Authorization", `Bearer ${authUser.body.token}`)
          .end((err, res) => {
            console.log(res.body);
            res.should.have.status(200);
            res.body.data.should.be.a("array");
            done();
          });
      });

      it("checks the contact", done => {
        app
        .get(`/fake/to/1`)
          .set("Authorization", `Bearer ${authUser.body.token}`)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.have.property("error");
            done();
          });
      });
    });

    // describe("/PUT contacts", () => {
    //   it("updates a contact", done => {
    //     app
    //     .put(`/contacts/${authUser.body.user.user_id}`)
    //     .send({
    //       name: "test",
    //       phoneNumber: 1234544444})
    //       .set("Authorization", `Bearer ${authUser.body.token}`)
    //       .end((err, res) => {
    //         console.log(res.body);
    //         res.should.have.status(200);
    //         res.body.should.be.a("object");
    //         done();
    //       });
    //   });
    // });

    // describe("/DELETE contacts", () => {
    //   it("deletes a contact", done => {
    //     app
    //     .delete(`/contacts/${authUser.body.user.user_id}`)
    //       .set("Authorization", `Bearer ${authUser.body.token}`)
    //       .end((err, res) => {
    //         res.should.have.status(200);
    //         res.body.should.be.a("object");
    //         done();
    //       });
    //   });
    // });
  });
});