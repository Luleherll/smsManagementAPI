const { decodeToken } = require("../helpers/jwt");
const { errorOcurred, onSuccess } = require("../helpers");
const { insertData } = require("../db/queries");
const { execQuery, dataLookup } = require("../db");

module.exports = {
  sendMessage: async (req, res, next) => {
    const success = "Message sent.";
    const sender = decodeToken(req.token);
    const { message } = req.body;
    const receiver = await dataLookup("contacts", ["name"], [req.params.name]);
    if (!receiver.length) {
      return res.status(400).json({ error: "Contact not found." });
    }

    await execQuery(
      insertData("messages", ["sender", "receiver", "body", "read"], "_id"),
      [sender, receiver[0].user_id, message, false],
      res,
      onSuccess(res, success, 201),
      errorOcurred()
    );
  },

  conversation: async (req, res, next) => {
    const sender = decodeToken(req.token);
    const receiver = await dataLookup("contacts", ["name"], [req.params.name]);
    const onSuccess = response => {
      res.status(200).json({ data: {
        to: response.rows.filter(msg => msg.sender === sender),
        from: response.rows.filter(msg => msg.sender === receiver[0].user_id)
      } });
    };
    await execQuery(
      `
      SELECT a.sender, a.receiver, a.body, a.read
      FROM messages AS a JOIN messages AS b USING (body)
      WHERE a.sender = $1 AND b.receiver = $2 OR a.sender = $2 AND b.receiver = $1;
      `,
      [sender, receiver[0].user_id],
      res,
      onSuccess,
      errorOcurred
    );
  }
};
