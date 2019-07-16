module.exports = {
  UserSchema: {
    name: {regExp: /^([a-zA-Z0-9 _-]+)$/, msg: '[ Name ] should only be alphanumeric, spaces and underscores'},
    phoneNumber: {regExp: /^\d{9,}$/, msg: '[ phone number ] should be a minimum of 9 numbers'},
    password: {regExp: /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{8,}$/, msg: '[ password ] should be a minimum of 8 characters.'}
  
  }
}