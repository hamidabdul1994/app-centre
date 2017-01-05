var express = require('express');
var router = express.Router();
var commonMethod = require("../common/commonMethod");
var redisClient = require('redis').createClient(14344, 'redis-14344.c10.us-east-1-4.ec2.cloud.redislabs.com', {no_ready_check: true}); //
/**POST (request)**/
router.post('/', function(req, res) {
  try{
    a = req.body.packageData.replace(/'/g, '"');  //to remove space it give error while converting string to array
    var packages = JSON.parse(a);
    Promise.all(packages.map(fn))
        .then(function(data) {
            res.send(JSON.stringify({
                status: "200",
                message: "Package update is successful"
            }));
        }).catch(function(err) {
            res.send(JSON.stringify(err));
        });
  }catch(e){
    res.status(400).send("Bad Header body");
  }


});
module.exports = router;


/******** function calling for iterating and giving promise either we did scraping or not**********/
var fn = function iterate(packageData) {
    return new Promise(function(resolve, reject) {
        updatePackage(packageData)
            .then(function(data) {
                resolve(data);
            }).catch(function(err) {
                reject(err);
            })
    });
}

/**************** Funaction having scaping , storing data into mongo and redis caching **********************/
function updatePackage(packageName) {
    /** Handle Asyn call **/
    return new Promise(function(resolve, reject) {
        var hashKey = commonMethod.generateHashCode(packageName); /*** Generating HashKey***/
        var url = "https://play.google.com/store/apps/details?id=" + packageName;
        var userLang = "en"; //navigator.language || navigator.userLanguage;
        userLang = (userLang.search("en") !== -1 ? "en" : userLang); //Checking locale
        var redisKey = packageName+"-"+userLang;
        /****** Check HashMap Package Data is available or not******/
        redisClient.hgetall(hashKey, function(error, hmData) {
            /* WHen HashMap Having some value**/
            if (hmData !== null && hmData[redisKey] !== undefined)
                var hmPackData = JSON.parse(hmData[redisKey]);

            /*** When HashMap has nothing**/
            if (hmData === null || hmPackData === undefined) {
                commonMethod.scrapePackage(url, userLang,packageName).then(commonMethod.saveInMongo).then(function(mongoData) {
                    var tempObjId = {};
                    tempObjId[redisKey] = JSON.stringify({
                        "packageName": packageName,
                        "ID": mongoData.packageId,
                        "locale": mongoData.locale,
                        "category": mongoData.category,
                        "catId": mongoData.catId
                    });
                    redisClient.hmset(hashKey, tempObjId);
                    resolve(mongoData.data);
                }).catch(function(data) {
                    reject(data.error);
                });

            } else {
                /**return redis cache**/
                commonMethod.scrapePackage(url, userLang,packageName).then(function(data) {
                    var packInfo = JSON.parse(hmData[redisKey]);
                    if(data.category === packInfo.category) {
                        resolve(hmData[redisKey]);
                    } else {
                        commonMethod.updateMongo(data, packInfo.ID).then(function(val) {
                            var tempObjId = {};
                            tempObjId[redisKey] = JSON.stringify({
                                "packageName": packageName,
                                "ID": val.packageId,
                                "locale": val.locale,
                                "category": val.category,
                                "catId": val.catId
                            });
                            redisClient.hmset(hashKey, tempObjId);
                            resolve(tempObjId);
                        });
                    }
                }).catch(function(err){
                  reject(err);
                })
            }
        });
    });
}
