"use strict";

const { log } = require('../helpers/logger');
const datamartAuthentication = require('../helpers/authenticationOracle');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const stream = require('stream');
const xmlReader = require('../sax-reader/xmlReader');

var storage = multer.memoryStorage();
var upload = multer({ storage: storage }).any();


/**
 * analyse the content of the text/plain file and extract
 * 1) ComponentName,
 * 2) repository =git@rgscmsrv01.airsystems.thales
 * 3) initial tag => Component baseline
 * 4) final tag => OPTIONAL Component Baseline 
 * 
 * @param {*} file 
 */
function retrieveConfFileContent(file) {

    return new Promise(function (resolve, reject) {

        log(" retrieve XML configuration file content= " + file.originalname);
        //log(typeof file);
        if (file.hasOwnProperty('buffer')) {
            var bufferStream = new stream.PassThrough();
            bufferStream.end(file.buffer);
            xmlReader.readXml(bufferStream)
                .then(componentData => {
                    resolve(componentData);
                })
                .catch(error => {
                    log(error);
                    reject(error);
                });
        } else {
            reject("Expecting buffer within the received file!!!");
        }
    });
}

/**
 * 
 * @param {*} initialFinalFileType 
 * @param {*} req 
 */
function uploadFile(req) {

    log("=================================================");
    let results = undefined;
    let errors = undefined;

    return new Promise(function (resolve, reject) {

        //console.log(req.files);
        req.files.forEach(file => {
            // DropZone has been configured to accept only one file
            log("original file name= " + file.originalname);
            log("original file mime type = " + file.mimetype);

            if (file.mimetype === 'text/xml') {
                retrieveConfFileContent(file)
                    .then(componentData => {
                        resolve({ 'componentData': componentData, 'xml': String(file.buffer) });
                    })
                    .catch(error => {
                        log(error);
                        reject(error);
                    });
            }
            else {
                errors = 'File Mime Type is not XML -- ' + file.mimetype;
                reject(errors);
            }
        });
    });
}

/**
 * route triggered when the user drops an XML Configuration file in a drop zone...
 */
module.exports.XmlConfigurationFile = function (req, res) {

    log(" XML configuration file received !!!");
    upload(req, res, function (err) {
        if (err) {
            // An error occurred when uploading
            let errMessage = "Error - an error occurs during the file uploading - err= " + String(err);
            log(errMessage);
            res.locals.errors = JSON.stringify(errMessage);
            res.render('pages/error');
            res.end;
        } else {
            log("multer any - triggered OK ");
            uploadFile(req)
                .then(results => {
                    res.json({ 'results': results, 'errors': undefined });
                })
                .catch(err => {
                    res.json({ 'results': undefined, 'errors': err });
                });
        }
    });
}