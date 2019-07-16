const { verifyToken, decodeToken } = require("../helpers/jwt");
const { onSuccess, errorOcurred } = require('../helpers');
const { insertData, updateData } = require("../db/queries");
const { execQuery } = require("../db");

const { UNIQUE_CONSTRAINT_CODE } = require("../config");

module.exports = {
  getUserContacts: async(req, res, next) => {
    const onSuccess = response => {
      console.log(response.rows);
      res.status(200).json({ data: {...response.rows} })
    };
    const userId = decodeToken(req.token);
    await execQuery(
      "SELECT * FROM contacts WHERE owner = $1;",
      [userId],
      res,
      onSuccess,
      errorOcurred
    );
  },
  addContact: async(req, res, next) => {
    const message = "Contact successfully added.";
    const userId = decodeToken(req.token);
    const { name, phoneNumber } = req.body;
    await execQuery(
      insertData('contacts', ['owner', 'name', 'number'], 'id'),
      [userId, name, phoneNumber],
      res,
      onSuccess(res, message, 201),
      errorOcurred
    );
  },
  updateContact: async(req, res, next) => {
    const message = "Contact successfully updated.";
    const id = req.params.id;
    const userId = decodeToken(req.token);
    const { name, phoneNumber } = req.body;
    await execQuery(
      updateData('contacts', ['name', 'number'], ['owner', 'id'], 'id'),
      [name, phoneNumber, userId, id],
      res,
      onSuccess(res, message, 200),
      errorOcurred
    );
  },
  deleteContact: async(req, res, next) => {
    const message = "Contact successfully deleted.";
    const id = req.params.id;
    const userId = decodeToken(req.token);
    await execQuery(
      "DELETE FROM contacts WHERE owner = $1 and id = $2;",
      [userId, id],
      res,
      onSuccess(res, message, 200),
      errorOcurred
    );
  }
}