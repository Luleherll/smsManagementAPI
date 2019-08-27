const { decodeToken } = require("../helpers/jwt");
const { errorOcurred, onSuccess } = require("../helpers");
const { insertData } = require("../db/queries");
const { execQuery, dataLookup } = require("../db");

const fetchMessages = async (
  type,
  sender,
  res,
  receiver,
  onSuccess,
  errorOcurred
) => {
  const PATHS = ["to", "from", "conversation"];
  let query;
  if (PATHS.includes(type)) {
    query =
      type === "to"
        ? `
        SELECT a._id, a.sender, a.receiver, a.body, a.read
          FROM messages AS a JOIN messages AS b USING (body)
          WHERE a.sender = $1 AND b.receiver = $2;
        `
        : type === "from"
          ? `
        SELECT a._id, a.sender, a.receiver, a.body, a.read
          FROM messages AS a JOIN messages AS b USING (body)
          WHERE a.sender = $2 AND b.receiver = $1;
        `
          : `
  SELECT a._id, a.sender, a.receiver, a.body, a.read
    FROM messages AS a JOIN messages AS b USING (body)
    WHERE a.sender = $1 AND b.receiver = $2 OR a.sender = $2 AND b.receiver = $1;
  `;

    await execQuery(query, [sender, receiver], res, onSuccess, errorOcurred);
    return;
  }
  return res.sendStatus(404);
};

module.exports = {
  sendMessage: async (req, res, next) => {
    const success = "Message sent.";
    const sender = decodeToken(req.token);
    const { message } = req.body;
    const receiver = await dataLookup("contacts", ["name", 'owner'], [req.params.name, sender]);
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
    const receiver = await dataLookup("contacts", ["name", 'owner'], [req.params.name, sender]);
    const type = req.params.type;
    const onSuccess = response => {
      const to = response.rows.filter(msg => msg.sender === sender);
      const sent = response.rows.filter(
        msg => msg.sender === receiver[0].user_id
      );
      const data =
        type === "to" ? to : type === "from" ? sent : { to: to, from: sent };
      res.status(200).json({
        data
      });
    };
    fetchMessages(
      type,
      sender,
      res,
      receiver[0].user_id,
      onSuccess,
      errorOcurred
    );
  },
  getMessage: async (req, res, next) => {
    const sender = decodeToken(req.token);
    const receiver = await dataLookup("contacts", ["name"], [req.params.name]);
    if (!receiver.length) { return res.status(400).json({ error: "Contact not found." });}
    const onSuccess = response => {
      res.status(200).json({
        data: response.rows
      });
    };
    await execQuery(
      "SELECT * FROM messages WHERE _id = $1 and receiver = $2;",
      [req.params.msg_id, receiver[0].user_id],
      res,
      onSuccess,
      errorOcurred
    );
  }
};
