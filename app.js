"use strict";

const express = require('express');
const PORT = process.env.PORT || '3030';
const app = express();
const winston = require('winston');
var {Loggly} = require('winston-loggly-bulk');

winston.add(new Loggly({
    token: "8b356096-ae55-428e-bb91-d486e81a0244",
    subdomain: "https://yusufjolaoso.loggly.com",
    tags: ["Winston-NodeJS"],
    json: true
}));

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.printf(info => {
            return `${info.timestamp} ${info.level}: ${info.message}`;
        })
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
      //
      // - Write to all logs with level `info` and below to `combined.log` 
      // - Write all logs error (and below) to `error.log`.
      //
    //   new winston.transports.Console(),
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' })
    ]
  });

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// 
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple()
    }));
  }

app.get('*', (req, res) => {
    logger.info('info', req);
    winston.log('info', 'Hello World');
    res.send({
        'Greetings': 'Hello World!!!'
    });
})


app.listen(PORT, (req, res) =>{
    console.log(`Application is listening to ${PORT}`);
})