const { dbClient } = require("../app");
const { signToken } = require("../helpers/jwt");
const { insertUser } = require("../db/queries");
const { execQuery } = require("../db");

const { UNIQUE_CONSTRAINT_CODE } = require("../config");

const errorOcurred = (err, res) => {
  let errorMsg = "An error has occurred. Please try again";
  if (err.code === UNIQUE_CONSTRAINT_CODE) {
    errorMsg = "Phone number is already registered.";
  }
  return res.status(403).json({ error: errorMsg });
};

module.exports = {
  signUp: async (req, res, next) => {
    const { name, phoneNumber, password } = req.body;
    const onSuccess = response =>
      res.status(201).json({ message: "User successfully registered." });

    await execQuery(
      "INSERT INTO users(name, number, password) VALUES($1, $2, $3) RETURNING user_id;",
      [name, phoneNumber, password],
      res,
      onSuccess,
      errorOcurred
    );
  },
  signIn: async (req, res, next) => {
    const { phoneNumber, password } = req.body;
    const onSuccess = response => {
      if (response.rowCount === 0) {
        res.status(401).json({ error: "User is not registered." });
        return;
      }
      const { user_id, name, number } = response.rows[0];
      res
        .status(200)
        .json({ token: signToken(user_id), user: { name, number } });
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
