module.exports = {
  errorOcurred: (custom = null) => (err, res) => {
    const error = custom ? custom(err) : custom;
    const errorMsg = error ? error.text : "An error has occurred. Please try again";
    return res.status(error ? error.status : 500).json({ error: errorMsg });
  },
  onSuccess: (res = null, message = null, status = null) => response => res.status(status).json({ message })
};
