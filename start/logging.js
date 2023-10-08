require("express-async-errors");
const winston = require("winston");
// require('winston-mongodb');

module.exports = function () {
  // process.on('uncaughtException', (ex) => {
  //     console.log('We got an uncaught exception');
  //     winston.error(ex.message, ex)
  // })

  winston.add(
    new winston.transports.File({
      filename: "combined.log",
      handleRejections: true,
      handleExceptions: true,
    })
  );
  winston.add(
    new winston.transports.Console({
      handleRejections: true,
      handleExceptions: true,
      // colorize: true,
      // prettyPrint: true
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.prettyPrint()
      ),
    })
  );

  // winston.handleException(new winston.transports.File({
  //     filename: 'uncaughExceptions.log'
  // }))

  // winston.add(winston.transports.File, {
  //     filename: 'logfile.log'
  // })

  winston.add(
    new winston.transports.File({
      filename: "logfile.log",
    })
  );
  // winston.add(new winston.transports.MongoDB({
  //     db: 'mongodb://127.0.0.1:27017/Vildy',
  //     level: 'info',
  // }))
};
