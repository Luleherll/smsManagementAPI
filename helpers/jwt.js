const JWT = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

module.exports = {
  signToken: userId => {
    return JWT.sign(
      {
        iss: "smsmanagerapi",
        sub: userId,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1)
      },
      JWT_SECRET
    );
  },
  verifyToken: () => {
    return (req, res, next) => {
      const authHeader = req.headers["authorization"];
      if (typeof authHeader !== "undefined") {
        const bearerToken = authHeader.split(" ")[1];
        req.token = bearerToken;
        next();
      } else {
        res.sendStatus(403);
      }
    };
  },
  decodeToken: (token) => JWT.verify(token, JWT_SECRET).sub
};
