const { decodeToken } = require("../helpers/jwt");
const { errorOcurred, onSuccess } = require("../helpers");
const { insertData, updateData } = require("../db/queries");
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
    const { message } = req.body;

    await execQuery(
      insertData("messages", ["sender", "receiver", "body", "read"], "_id"),
      [req.sender, req.receiver.user_id, message, false],
      res,
      onSuccess(res, success, 201),
      errorOcurred()
    );
  },
  conversation: async (req, res, next) => {
    const type = req.params.type;
    const onSuccess = response => {
      const to = response.rows.filter(msg => msg.sender === req.sender);
      const sent = response.rows.filter(
        msg => msg.sender === req.receiver.user_id
      );
      const data =
        type === "to" ? to : type === "from" ? sent : { to: to, from: sent };
      res.status(200).json({
        data
      });
    };
    fetchMessages(
      type,
      req.sender,
      res,
      req.receiver.user_id,
      onSuccess,
      errorOcurred
    );
  },
  getMessage: async (req, res, next) => {
    const onSuccess = response => {
      res.status(200).json({
        data: response.rows
      });
    };
    await execQuery(
      "SELECT * FROM messages WHERE _id = $1 and receiver = $2;",
      [req.params.msg_id, req.receiver.user_id],
      res,
      onSuccess,
      errorOcurred
    );
  },
  editMessage: async (req, res, next) => {
    const onSuccess = response => {
      if (response.rowCount === 0) {
        return res.status(400).json({ error: 'Message not found.'});
      }
      return res.status(200).json({ message: "Message successfully updated.", data: response.rows[0] });
    };
    const id = req.params.msg_id;
    const { message } = req.body;
    await execQuery(
      updateData('messages', ['body'], ['sender', 'receiver', '_id'], '*'),
      [message, req.sender, req.receiver.user_id, id],
      res,
      onSuccess,
      errorOcurred
    );
  },

  deleteMessage: async (req, res, next) => {
    const onSuccess = response => {
      if (response.rowCount === 0) {
        return res.status(400).json({ error: 'Message not found.'});
      }
      return res.status(200).json({ message: "Message successfully deleted." });
    };
    const id = req.params.msg_id;
    await execQuery(
      "DELETE FROM messages WHERE sender = $1 AND receiver = $2 AND _id = $3;",
      [req.sender, req.receiver.user_id, id],
      res,
      onSuccess,
      errorOcurred
    );
  },
};
