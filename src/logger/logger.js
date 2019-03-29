const { createLogger, format, transports } = require('winston')
var winston = require('winston')
const fs = require('fs')
require('winston-daily-rotate-file')

class Logger {
  levels = {
    error: 0,
    debug: 1,
    warn: 2,
    data: 3,
    info: 4
  }

  colors = {
    error: 'red',
    debug: 'blue',
    warn: 'yellow',
    data: 'grey',
    info: 'green'
  }

  constructor(nameFolder) {
    this.nameFolder = nameFolder
    if (!fs.existsSync(nameFolder)) {
      fs.mkdirSync(nameFolder);
    }
  }

  writeLog = (fileName) => createLogger({
    // change level if in dev environment versus production
    levels: this.levels,
    format: format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
      new transports.Console({
        levels: this.levels,
        format: format.combine(
          format.colorize(),
          format.printf(
            info => `${info.timestamp} ${info.level}: ${info.message}`
          )
        )
      }),
      new (winston.transports.DailyRotateFile)({
        filename: `${this.nameFolder}/%DATE%-${fileName}.log`,
        datePattern: 'YYYY-MM-DD'
      })
    ]
  })
}

export default Logger
