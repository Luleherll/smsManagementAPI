const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(morgan('dev'));
app.use(bodyParser.json());

// routes
app.use('/users/auth', require('./routes/index.js/index.js'));

app.listen(port);
console.log(`server listening at port ${port}`);