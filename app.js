/***
File Name:app.js
Created By:Hamid Raza Noori
date:21/09/2016
Purpose:Model of IPL Application and give the different states
***/
var express = require('express'),
    bodyParser = require('body-parser'),
    logger = require("morgan"),
    cors = require('cors'),
    app = express(),
    port = process.env.PORT || 3001;
app.use(logger("dev"));
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json());
app.use(express.static('./FrontEnd'));
app.use(require('./controller/index.js'));

/*
 |--------------------------------------------------------------------------
 | Start the Server
 |--------------------------------------------------------------------------
 */
app.listen(port, function() {
    console.log('Express server listening on port ' + port);
});
