module.exports = {
  validateData: (schema) => {
    
    return (req, res, next) => {
      const data = Object.keys(req.body);
      for (const key in schema) {
        if (!data.includes(key)) {
          return res.status(400).json({error: `${key} is required.`});
        }
      }
      for (const key in req.body) {
        console.log(req.body[key]);
        const match = schema[key];
        if (!match.regExp.test(req.body[key])) {
          return res.status(400).json({error: match.msg});
        }
      }
    next();
  }
}
}