var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("./sw/sw.js", {scope: "./"}).then(function(registration) {
        console.log("Service worker registered!");
    }).catch(function(err) {
        console.log("Service worker failed to register", err);
    })
}


module.exports = app;