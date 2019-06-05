const JWT = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

signToken = user => {
  return JWT.sign({
      iss: 'smsmanagerapi',
      sub: user.id,
      iat: new Date().getTime(),
      exp: new Date().setDate( new Date().getDate() + 1)
    }, JWT_SECRET);
};

verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (typeof authHeader !== 'undefined') {
    const bearerToken = authHeader.split(' ')[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
};

module.exports = {signToken, verifyToken};
