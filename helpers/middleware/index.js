const { dataLookup } = require("../../db");
const { decodeToken } = require("../jwt");


module.exports = {
  getCurrentUser: async(req, res, next) => {
    req.sender = decodeToken(req.token);
    next();
  },
  getContact: (by) => async(req, res, next) => {
    const arg = by === 'id' ? req.params.id : req.params.name;
    const receiver = await dataLookup("contacts", [by, 'owner'], [arg, req.sender]);
    if (receiver.length === 0) { return res.status(400).json({ error: "Contact not found." });}
    req.receiver = receiver[0];
    next();
  }
};
