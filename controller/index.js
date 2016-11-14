/****
File Name:index.js
Created By:Hamid Raza Noori
date:07/11/2016
Purpose:To handle several state for front end, and send the data as a response
****/

var express = require('express'),
    router = express.Router(),
    client = require('redis').createClient(),
    redisData = require("../common/saveRedisData.js");

client.on('connect', function() {
    console.log('Redis Server connected');
});

client.exists('catPackage', function(err, reply) {
    if (reply === 1) {
        console.log('exists');
    } else {
      console.log("Enter the data in redis");
        redisData.saveJSONInRedis();
    }
});

/*** /getAppDetails state is use to give app details to Front End page ***/
router.use('/getAppDetails', require('./getAppDetails.js'));

/*** /getCatagoryType state is use to give app store data to frint End page ***/
router.use('/getCatagoryType', require('./getCatagoryType.js'));

module.exports = router;
