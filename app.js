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

// Load Routes
app.use('/api', article_routes);

module.exports = app;