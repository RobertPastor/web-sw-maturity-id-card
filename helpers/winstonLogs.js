'use strict'

const winston = require('winston');
const path = require('path');
const { log } = require('./log');
const fs = require('fs');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const date = new Date();
//const dateString = date.toISOString();
// inside MOBA Xterm - :: semi colon are not allowed in a file path
const dateString = formatDateTime4WinstonLogger(new Date()).replace(new RegExp(' ', 'g'), '-').replace(new RegExp(':', 'g'), '-');

/**
 * compute output json file path , either
 * 1) within /localdata/cars/klocgitcomp is WRITE rights
 * 2) process.cwd() if cannot write into /localdata/cars/klocgitcomp
 */
function computeLogPath() {

    let outputFilePath = "/localdata/cars/klocgitcomp";
    let jsonLogFile = `web-kloc-project_${dateString}.json`;
    try {
        // warning accessSync does not return anything
        fs.accessSync(outputFilePath, fs.W_OK);
        outputFilePath = path.resolve(outputFilePath, jsonLogFile);
        log('Okay - can write into path =' + outputFilePath);
    } catch (err) {
        log("NOK - cannot write in folder= " + outputFilePath + " - error= " + String(err));
        outputFilePath = path.resolve(process.cwd(), path.resolve('logger', jsonLogFile));
        log('Okay - will write following log file path= ' + outputFilePath);
    }
    return outputFilePath;
}

const logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: computeLogPath(),
            json: true,
            timestamp: () => formatDateTime4WinstonLogger(new Date())
        }),
        new winston.transports.Console({
            level: 'warn',
            json: false,
            colorize: true
        })
    ]
});

function padWithZeroes(n, width) {
    n = String(n);
    while (n.length < width) {
        n = '0' + n;
    }
    return n;
}

/**
 * 
 * @param {Date} date - a date instance
 */
function formatDateTime4WinstonLogger(dateTime) {

    var date_options = { weekday: "long", year: "numeric", month: "long", day: "numeric", timeZone: "Europe/Paris", hour12: false };
    //console.log ( dateTime.toLocaleTimeString("fr-FR", date_options)  + ' - ' + data);
    let strMessage = '';
    strMessage = days[dateTime.getDay()] + ', ' + months[dateTime.getMonth()] + ' ' + dateTime.getDate() + ', ' + dateTime.getFullYear();
    strMessage = padWithZeroes(String(dateTime.getDate()), 2) + '-' + padWithZeroes(String(dateTime.getMonth() + 1), 2) + '-' + String(dateTime.getFullYear());
    strMessage += ' ';
    strMessage += String('00' + dateTime.getHours()).slice(-2);
    strMessage += ':' + String('00' + dateTime.getMinutes()).slice(-2);
    strMessage += ':' + String('00' + dateTime.getSeconds()).slice(-2);
    //strMessage += ' - ' + getLoggerFunctionLine();
    //strMessage += ' - ' + String(path.basename(__winstonFileName)) + '[' + String(__winstonLine) + ']';
    return strMessage;
}

module.exports = logger;