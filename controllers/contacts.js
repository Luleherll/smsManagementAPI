const { verifyToken, decodeToken } = require("../helpers/jwt");
const { onSuccess, errorOcurred } = require('../helpers');
const { insertData, updateData } = require("../db/queries");
const { execQuery, dbClient, dataLookup } = require("../db");

const { UNIQUE_CONSTRAINT_CODE } = require("../config");

module.exports = {
  getUserContacts: async(req, res, next) => {
    const onSuccess = response => {
      res.status(200).json({ data: response.rows.map(contact => (({owner, ...others}) => ({...others}))(contact)) });
    };
    await execQuery(
      "SELECT * FROM contacts WHERE owner = $1;",
      [req.sender],
      res,
      onSuccess,
      errorOcurred
    );
  },
  addContact: async(req, res, next) => {
    const addError = err => {
      if (err.code === UNIQUE_CONSTRAINT_CODE) return { text: "Contact already exist.", status: 403 };
      return null;
    };
    const message = "Contact successfully added.";
    const { name, phoneNumber } = req.body;
    const result = await dataLookup('users', ['number'], [phoneNumber]);

    if (!result.length) {return res.status(400).json({ error: 'Phone number is not registered.'})};
    if (result[0].user_id === req.sender) {return res.status(400).json({ error: 'Cannot contact yourself.'})};

    await execQuery(
      insertData('contacts', ['owner', 'name', 'number', 'user_id'], 'id'),
      [req.sender, name, phoneNumber, result[0].user_id],
      res,
      onSuccess(res, message, 201),
      errorOcurred(addError)
    );
  },
  updateContact: async(req, res, next) => {
    const onSuccess = response => res.status(200).json({ message: "Contact successfully updated." });
    const id = req.params.id;
    const { name, phoneNumber } = req.body;
    console.log(updateData('contacts', ['name', 'number'], ['owner', 'id'], 'id'));
    await execQuery(
      updateData('contacts', ['name', 'number'], ['owner', 'id'], 'id'),
      [name, phoneNumber, req.sender, id],
      res,
      onSuccess,
      errorOcurred
    );
  },
  deleteContact: async(req, res, next) => {
    const onSuccess = response => res.status(200).json({ message: "Contact successfully deleted." });
    const id = req.params.id;
    await execQuery(
      "DELETE FROM contacts WHERE owner = $1 and id = $2;",
      [req.sender, id],
      res,
      onSuccess,
      errorOcurred
    );
  }
}