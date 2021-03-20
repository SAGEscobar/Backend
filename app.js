'use strict'

// Load Node's Modules
var express = require('express');
var bodyParser = require('body-parser');

// Ejecutar Express (http)
var app = express();
var article_routes = require('./routes/article');

// Midelware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// Load Routes
app.use('/api', article_routes);

module.exports = app;