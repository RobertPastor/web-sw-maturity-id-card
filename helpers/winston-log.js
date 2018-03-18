'use strict'

const { Logger, transports: { File, Console } } = require('winston');
const path = require('path');
const fs = require('fs');

let logger;

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const stackLevel = 6;
/**
 * 
 * @param {string} filename - input filename
 */
function createLogger(filename) {

    if (logger) {
        return logger;
    }

    const dateString = formatDateTimeForFilename(new Date());
    const filePath = path.join('/localdata', 'cars', 'klocgitcomp');

    const consoleTransport = new Console({
        level: 'debug',
        json: false,
        timestamp: () => formatDateTime4WinstonLogger(new Date()),
        formatter
    });
    try {
        if (fs.accessSync(filePath, fs.constants.W_OK)) {
            log('can write into= ' + filePath);
            const fileTransport = new File({
                level: 'info',
                filename: `${filename}_${dateString}.log`,
                dirname: filePath,
                json: true,
                timestamp: () => formatDateTime4WinstonLogger(new Date()),
                formatter
            });
            logger = new Logger({ transports: [consoleTransport, fileTransport] });
        } else {
            logger = new Logger({ transports: [consoleTransport] });
        }
    } catch (err) {
        logger = new Logger({ transports: [consoleTransport] });
        logger.warn('Try accessing= ' + filePath + ' error= ' + err);
    }
    return logger;
}

const padding = '                    # ';

/**
 * 
 * @param {*} options 
 */
function formatter(options) {

    const { timestamp, message, meta, level } = options

    const initial = `${timestamp()} # `
    const msgText = padLines(message)

    if (Object.keys(meta).length) {

        const { index, msg, fields } = meta

        const metaText = level === 'error'
            ? `ERROR ${padLines(msg)}`
            : level === 'warning'
                ? `WARNING ${padLines(msg)}`
                : `${padLines(msg)}`

        const text = index
            ? msgText
                ? `${initial}${msgText}\n${padding}Record ${index} ${metaText}`
                : `${initial}Record ${index} ${metaText}`
            : msgText
                ? `${initial}${msgText}\n${padding}${metaText}`
                : `${initial}${metaText}`

        return text
    }

    const text = `${initial}${msgText}`
    return text
}

/**
 * 
 * @param {*} text 
 */
function padLines(text) {

    if (!text) {
        return ''
    }

    const chunks = text.split('\n')
    const [first, ...rest] = chunks

    const paddedText = rest
        .reduce((acc, line) =>
            `${acc}\n${padding}${line}`
        ,
        first
        )
    return paddedText
}

function getLoggerFunctionLine() {
    let errorStack = (new Error().stack);
    let logLineDetails = (errorStack.split("at ")[3]).trim();
    return logLineDetails;
}

Object.defineProperty(global, '__winstonStack', {
    get: function () {
        var orig = Error.prepareStackTrace;
        Error.prepareStackTrace = function (_, stack) {
            return stack;
        };
        var err = new Error;
        Error.captureStackTrace(err, {});
        var stack = err.stack;
        Error.prepareStackTrace = orig;
        return stack;
    }
});

Object.defineProperty(global, '__winstonLine', {
    get: function () {
        return __winstonStack[stackLevel].getLineNumber();
    }
});

Object.defineProperty(global, '__winstonFunction', {
    get: function () {
        let stack = __stack;
        return __winstonStack[stackLevel].getFunctionName();
    }
});

Object.defineProperty(global, '__winstonFileName', {
    get: function () {
        return __winstonStack[stackLevel].getFileName();
    }
});

/**
 * 
 * @param {Date} date - a date instance
 */
function formatDateTime4WinstonLogger(dateTime) {

    var date_options = { weekday: "long", year: "numeric", month: "long", day: "numeric", timeZone: "Europe/Paris", hour12: false };
    //console.log ( dateTime.toLocaleTimeString("fr-FR", date_options)  + ' - ' + data);
    let strMessage = '';
    strMessage = days[dateTime.getDay()] + ', ' + months[dateTime.getMonth()] + ' ' + dateTime.getDate() + ', ' + dateTime.getFullYear();
    strMessage += ', ';
    strMessage += String('00' + dateTime.getHours()).slice(-2);
    strMessage += ':' + String('00' + dateTime.getMinutes()).slice(-2);
    strMessage += ':' + String('00' + dateTime.getSeconds()).slice(-2);
    //strMessage += ' - ' + getLoggerFunctionLine();
    //strMessage += ' - ' + String(path.basename(__winstonFileName)) + '[' + String(__winstonLine) + ']';
    return strMessage;
}

Date.prototype.toTimeZoneIsoString = function () {
    var tzo = -this.getTimezoneOffset(),
        dif = tzo >= 0 ? '-TZplus-' : '-TZminus-',
        pad = function (num) {
            var norm = Math.floor(Math.abs(num));
            return (norm < 10 ? '0' : '') + norm;
        };
    return this.getFullYear() +
        '_' + months[this.getMonth()] +
        '_' + pad(this.getDate()) +
        'T' + pad(this.getHours()) +
        '-' + pad(this.getMinutes()) +
        '-' + pad(this.getSeconds()) +
        dif + pad(tzo / 60) +
        ':' + pad(tzo % 60);
}


/**
 * 
 * @param {Date} date - a date instance
 */
function formatDateTimeForFilename(date) {

    return date
        .toTimeZoneIsoString()
        .replace(/\..*/, '')
        .replace('T', '_')
        .replace(/:/g, '-')
}

/**
 * 
 * @param {Date} date - a date instance
 */
function formatDateTime(date) {

    return date
        .toISOString()
        .replace(/\..*/, '')
        .replace('T', ' ')
}

module.exports = { createLogger }