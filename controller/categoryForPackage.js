// var bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();
var commonMethod = require("../common/commonMethod");
var redisClient = require('redis').createClient();

/** For Testing i am Generating get Method***/
router.get('/:url', function(req, res) {
    console.log("categoryForPackage called");
    var package_name = req.params.url;
    var hashKey = commonMethod.generateHashCode(package_name);    /*** Generating HashKey***/
    var url = "https://play.google.com/store/apps/details?id=" + package_name;
    var idStore = hashKey + "id"; //For Retriving package id
    var catStore = hashKey + "cat";
    console.log("id:", idStore);

    /****** Check HashMap Package Data is available or not******/
    redisClient.hgetall(idStore, function(error, hmData) {
        /*** When HashMap has nothing**/
        if (hmData === null || hmData[package_name] == null) {
            commonMethod.scrapePackage(url, function(data) {
                if (!data.error) {
                    commonMethod.saveInMongo(data.data, function(mongoData) {
                        if (!mongoData.error) {
                            var tempObjId = {},
                                tempObjCat = {}; /*** Declaring Object ***/
                            tempObjId[package_name] = mongoData.data.package_id; /***Package Name is Key and value is Package ID***/
                            tempObjCat[package_name] = mongoData.data.category; /*** Package Name is Key and category is value **/
                            redisClient.hmset(idStore, tempObjId);
                            redisClient.hmset(catStore, tempObjCat);
                            res.send(JSON.stringify(mongoData.data));
                        }
                    });
                } else {
                    res.send(data.error);
                }
            });
        } else {
            /**return redis cache**/
            console.log("having value");
            res.send(JSON.stringify(hmData[package_name]));

        }
    });


});
module.exports = router;
