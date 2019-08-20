module.exports = {
  UserSchema: {
    name: {regExp: /^([a-zA-Z0-9 _-]+)$/, msg: 'Name should only be alphanumeric, spaces and underscores'},
    phoneNumber: {regExp: /^\d{9,}$/, msg: 'Phone number should be a minimum of 9 numbers'},
    password: {regExp: /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{8,}$/, msg: 'Password should be a minimum of 8 characters.'}
  
  },
  messageSchema: { message: { regExp: /^(\s|\S)*(\S)+(\s|\S)*$/, msg: 'Message should not be empty.' }}
}