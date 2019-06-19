const router = require("express-promise-router")();
const usersControllers = require('../controllers/users');
const {validateUserDetails } = require('../helpers/validation');

router
  .route("/signup")
  .post(validateUserDetails(), usersControllers.signUp);

router
  .route("/signin")
  .post(usersControllers.signIn);

module.exports = router;