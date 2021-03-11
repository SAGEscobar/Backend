'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3900;

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/api_rest_blog', {useNewUrlParser: true})
    .then(()=> {
        console.log("Coneccion Exitosa :3");

        // Create Server
        app.listen(port, () => {
            console.log('y Escucha tambien :V');
        })
    });