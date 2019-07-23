const { decodeToken } = require("../helpers/jwt");
const { errorOcurred, onSuccess } = require('../helpers');
const { insertData } = require("../db/queries");
const { execQuery, dataLookup } = require("../db");
  

module.exports = {
  sendMessage: async(req, res, next) => {
    const success = "Message sent.";
    const sender = decodeToken(req.token);
    const { message } = req.body;
    const receiver = await dataLookup('contacts', ['name'], [req.params.name]);
    if (!receiver.length) { return res.status(400).json({ error: "Contact not found."}); }
    
    await execQuery(
      insertData('messages', ['sender', 'receiver', 'body', 'read'], '_id'),
      [sender, receiver[0].user_id, message, false],
      res,
      onSuccess(res, success, 201),
      errorOcurred()
    );
  }
}