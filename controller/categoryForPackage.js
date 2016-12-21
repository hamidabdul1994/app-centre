// var bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();
var commonMethod = require("../common/commonMethod");
var redisClient = require('redis').createClient(); //14344, 'redis-14344.c10.us-east-1-4.ec2.cloud.redislabs.com', {no_ready_check: true}

/** POST Method***/
router.post('/', function(req, res) {
    try{
    var reqData = req.body;
    var packageName = reqData.packageName;
    var hashKey = commonMethod.generateHashCode(packageName); /*** Generating HashKey***/
    var url = "https://play.google.com/store/apps/details?id=" + packageName;
    var userLang = reqData.locale; //navigator.language || navigator.userLanguage;
    userLang = (userLang.search("en") !== -1 ? "en" : userLang); /*Checking locale*/
    var redisKey = packageName+"-"+userLang;
    hashKey = "5e7";

    /****** Check HashMap Package Data is available or not******/
    redisClient.hgetall(hashKey, function(error, hmData) {
        /* WHen HashMap Having some value**/
        if (hmData[redisKey] !== undefined)
            var hmPackData = JSON.parse(hmData[redisKey]);

        /*** When HashMap has nothing**/
        if (hmData === null || hmPackData === undefined) {
            commonMethod.scrapePackage(url, userLang,packageName).then(commonMethod.saveInMongo).then(function(objData) {
              var data={};
              data[redisKey]=JSON.stringify({
                  "packageName": packageName,
                  "ID": objData.packageId,
                  "locale": objData.locale,
                  "category": objData.category,
                  "catId": objData.catId
              });
               redisClient.hmset(hashKey, data);
              res.send({package_name:packageName,category:objData.catId,category_name:objData.category});
            }).catch(function(data) {
                res.send(data.error);
            });

        } else {
            /**return redis cache**/
            var data = JSON.parse(hmData[redisKey])
            res.send({package_name:packageName,category:data.catId,category_name:data.category});

        }
    });
  }catch(e){
    res.status(400).send("Bad Header body");
  }


});
module.exports = router;
