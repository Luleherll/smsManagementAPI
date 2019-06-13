const router = require("express-promise-router")();
const usersControllers = require('../controllers/users');

router
  .route("/signup")
  .post(usersControllers.signUp);

router
  .route("/signin")
  .post(usersControllers.signIn);

module.exports = router;