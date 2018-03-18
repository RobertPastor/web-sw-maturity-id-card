"use strict";

const path = require('path');
const fs = require('fs');
const main = require('./main');

const { log } = require('../helpers/logger');

module.exports = function (app) {

    app.get('/', (req, res) => {
        log(req.hostname);
        res.render('pages/index');
    });

    app.get('/about', function (req, res) {
        res.render('pages/about');
    });

    app.post('/XmlConfigurationFile', main.XmlConfigurationFile);

}


