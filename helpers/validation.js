const schema = {
  name: {regExp: /^([a-zA-Z0-9 _-]+)$/, msg: '[ Name ] should only be alphanumeric, spaces and underscores'},
  phoneNumber: {regExp: /[0-9]{9,}/, msg: '[ phone number ] should be a minimum of 9 numbers'},
  password: {regExp: /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{8,}$/, msg: '[ password ] should be a minimum of 8 characters.'}

}

module.exports = {
  validateUserDetails: () => {
    
    return (req, res, next) => {
      const data = Object.keys(req.body);
      for (const key in schema) {
        if (!data.includes(key)) {
          res.status(400).json({error: `${key} should not be empty.`});
        }
      }
      for (const key in req.body) {
        const match = schema[key];
        if (!match.regExp.test(req.body[key])) {
          res.status(400).json({error: match.msg});
        }
      }
    next();
  }
}
}