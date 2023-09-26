const express = require("express");
const morgan = require('morgan');
const app = express();
const cors = require('cors');
require('dotenv').config();

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}


require('./startup/router')(app);
require('./startup/database')();


// Allow requests from specific origins (e.g., your client-side URL)
const allowedOrigins = ['http://localhost:3000', 'http://192.168.1.72:3000'];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};
app.use(cors(corsOptions));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

module.exports = server;

