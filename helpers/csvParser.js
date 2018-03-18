'use strict'

const fs = require('fs');
var parse = require('csv-parse');
const delimiter = ";";
const { log } = require('./logger');
const path = require('path');

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

Date.prototype.toTimeZoneIsoString = function () {
    var tzo = -this.getTimezoneOffset(),
        dif = tzo >= 0 ? '-TZplus-' : '-TZminus-',
        pad = function (num) {
            var norm = Math.floor(Math.abs(num));
            return (norm < 10 ? '0' : '') + norm;
        };
    return pad(this.getDate()) +
        '_' + months[this.getMonth()] +
        '_' + this.getFullYear() +
        '-' + pad(this.getHours()) +
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
        .replace(/:/g, '-')
}

function getOutputFolder(csvFileName) {

    let found = false;
    let filePath = path.resolve(process.cwd(), csvFileName);
    process.argv.forEach(function (argument, index) {
        if (argument === '-output') {
            found = true;
            log('process argv index= ' + index + ' -- process argv= ' + process.argv[index]);
            try {
                filePath = process.argv[index + 1];
                // suppress forward and backward slashes
                filePath = String(filePath).replace(/\//g, "");
                filePath = String(filePath).replace(/\\/g, "");
                log("Relative output folder is= " + filePath);
                try {
                    // start from process directory and add output folder 
                    filePath = path.resolve(process.cwd(), filePath);
                    log("Absolute output folder is= " + filePath);
                    // warning accessSync does not return anything
                    fs.accessSync(filePath, fs.R_OK);
                    filePath = path.resolve(filePath, csvFileName);
                } catch (err) {
                    log("Output folder= " + filePath + " -- not found -- error= " + String(err));
                    filePath = path.resolve(process.cwd(), csvFileName);
                }
            } catch (err) {
                log('Error while accessing process arguments - expected another argument after -datamart option !!!');
                filePath = path.resolve(process.cwd(), csvFileName);
                found = false;
            }
        }
    });
    return filePath;
}


function createFinalResultsWriteCsvFile(Prefix, Project, Component, dataToWrite) {

    return new Promise(function (resolve, reject) {

        log("------------ cvs Parser write output file --------------");
        const dateString = formatDateTimeForFilename(new Date());
        let csvFileName = Prefix + "_" + String(Project).replace(/ /g, "_") + "_" + String(Component).replace(/ /g, "_") + "_" + dateString + ".csv";
        let filePath = getOutputFolder(csvFileName);
        log(filePath);
        // create the file Stream
        let writeStream = fs.createWriteStream(filePath, { flags: 'w', encoding: 'utf-8', mode: '0666' });
        writeStream.on('error', function (err) {
            log('Some error occured - file either not saved or corrupted file saved.' + err);
            reject(err);
        })
        dataToWrite.map(function (elementArray) {
            elementArray.forEach(function (strValue) {
                if (strValue == null) {
                    writeStream.write("");
                } else {
                    if ((typeof strValue) == "string") {
                        writeStream.write(String(strValue).replace("\n", ""));
                    } else {
                        writeStream.write(String(strValue));
                    }
                }
                writeStream.write(";");
            })
            writeStream.write("\n");
        });
        writeStream.end(function () {
            log("end of file writing= " + filePath);
            resolve(true);
        });
    });
}


module.exports = {

    createFinalResultsWriteCsvFile: createFinalResultsWriteCsvFile
} 
