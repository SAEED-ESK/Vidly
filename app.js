const winston = require("winston");
const express = require("express");
const app = express();

require("./start/logging")();
require("./start/routes")(app);
require("./start/db")();
// require('./start/config')()
require("./start/validation")();

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  winston.info(`Listening on port ${port}...`)
);

module.exports = server;
