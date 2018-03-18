// Read the text file containing the Oracle DataMart authentication data
// module.exports = {
//  user          : "D3TRANS",
//  password      : "D3TS_SP106",
//  connectString : "spirula"
// };
//
// Read the file and print its contents.
'use strict'

const { log } = require('./logger');
const fs = require('fs');
const path = require('path');

//var 
var oracleDatamartUser = '';
var oracleDatamartPassWord = '';
var oracleDatamartConnectString = '';

module.exports = {

    datamartAuthenticationFileFound: function () {

        return new Promise(function (resolve, reject) {

            log('--------------- check Datamart authentication file ----------');
            let fileName = path.join(__dirname, 'datamartCredentials.json');
            fs.readFile(fileName, 'utf8', function (err, data) {
                if (err) {
                    log('Oracle Datamart authentication file = ' + fileName + ' --- not found !!!');
                    reject(false);
                } else {
                    log('OK: file= ' + fileName + ' -- found !!!');
                    //log(data);
                    try {
                        var jsonObj = JSON.parse(data);
                        if (jsonObj.hasOwnProperty('user')) {
                            oracleDatamartUser = jsonObj['user'];
                            log('Property user found - user= ' + oracleDatamartUser);
                        }
                        if (jsonObj.hasOwnProperty('password')) {
                            oracleDatamartPassWord = jsonObj['password'];
                            //log('Property password found - user= ' + oracleDatamartPassWord);
                        }
                        if (jsonObj.hasOwnProperty('connectString')) {
                            oracleDatamartConnectString = jsonObj['connectString'];
                            log('Property connectString found - user= ' + oracleDatamartConnectString);
                        }
                    } catch (err) {
                        log('Error - during file reading -- err= ' + String(err));
                        reject(false);
                    }
                    resolve(true);
                }
            });
        })
    },
    getOracleDataMartUser: function () {
        return oracleDatamartUser;
    },
    getOracleDatamartPassWord: function () {
        return oracleDatamartPassWord;
    },
    getOracleDatamartConnectString: function () {
        return oracleDatamartConnectString;
    }

}