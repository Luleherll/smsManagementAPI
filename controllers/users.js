const { dbClient } = require("../app");
const { signToken } = require("../helpers/jwt");
const { errorOcurred, onSuccess } = require('../helpers');
const { insertData } = require("../db/queries");
const { execQuery } = require("../db");

const { UNIQUE_CONSTRAINT_CODE } = require("../config");

module.exports = {
  signUp: async (req, res, next) => {
    const { name, phoneNumber, password } = req.body;
    const message = "User successfully registered.";
    const signUpError = err => {
      if (err.code === UNIQUE_CONSTRAINT_CODE) {
        return { text: "Phone number is already registered.", status: 403 };
      }
      return null;
    };
    await execQuery(
      insertData('users', ['name', 'number', 'password'], 'user_id'),
      [name, phoneNumber, password],
      res,
      onSuccess(res, message, 201),
      errorOcurred(signUpError)
    );
  },
  signIn: async (req, res, next) => {
    const { phoneNumber, password } = req.body;
    const onSuccess = response => {
      if (response.rowCount === 0) {
        return res.status(401).json({ error: "User is not registered." });
      }
      console.log(response.rows[0]);
      const { user_id, name, number } = response.rows[0];
      return res
        .status(200)
        .json({ token: signToken(user_id), user: { user_id, name, number } });
    };
    await execQuery(
      "SELECT * FROM users WHERE number = $1 and password = $2",
      [phoneNumber, password],
      res,
      onSuccess,
      errorOcurred
    );
  }
};
