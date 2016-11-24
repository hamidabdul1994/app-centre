// var bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();
var commonMethod = require("../common/commonMethod");
var redisClient = require('redis').createClient();

/** POST Method***/
router.get('/:url', function(req, res) {
    console.log("categoryForPackage called");
    var packageName = req.params.url;
    var hashKey = commonMethod.generateHashCode(packageName); /*** Generating HashKey***/
    var url = "https://play.google.com/store/apps/details?id=" + packageName;
    var idStore = hashKey + "id"; //For Retriving package id
    var userLang = "en"; //navigator.language || navigator.userLanguage;
    userLang = (userLang.search("en") !== -1 ? "en" : userLang); //Checking locale
    console.log("id:", idStore);

    /****** Check HashMap Package Data is available or not******/
    redisClient.hgetall(idStore, function(error, hmData) {

        /* WHen HashMap Having some value**/
        if (hmData !== null)
            var hmPackData = JSON.parse(hmData[packageName]);

        /*** When HashMap has nothing**/
        if (hmData === null || hmPackData["Name"] === null || hmPackData["locale"] !== userLang) {
            commonMethod.scrapePackage(url, userLang).then(commonMethod.saveInMongo).then(function(mongoData) {
                var tempObjId = {};
                tempObjId[packageName] = JSON.stringify({
                    "Name": packageName,
                    "ID": mongoData.data.packageId,
                    "locale": mongoData.data.locale,
                    "category": mongoData.data.category,
                    "catId": mongoData.data.catId
                });
                console.log(tempObjId);
                redisClient.hmset(idStore, tempObjId);
                res.send(JSON.stringify(mongoData.data));
            }).catch(function(data) {
                res.send(data.error);
            })

        } else {
            /**return redis cache**/
            console.log("having value");
            res.send(JSON.stringify(hmData[packageName]));

        }
    });


});
module.exports = router;
