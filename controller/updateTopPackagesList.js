var express = require('express');
var router = express.Router();
var commonMethod = require("../common/commonMethod");
var redisClient = require('redis').createClient(14344, 'redis-14344.c10.us-east-1-4.ec2.cloud.redislabs.com', {no_ready_check: true});
/**POST (request)**/
router.post('/', function(req, res) {
  try{
    var packages = JSON.parse(req.body.packageData);
    Promise.all(packages.map(fn))
        .then(function(data) {
            console.log("Woking Done...");
            res.send(JSON.stringify({
                status: "200",
                message: "Package update is successful"
            }));
        }).catch(function(err) {
            console.log("error..:", err);
            res.send(JSON.stringify("err"));
        });
    console.log("updateTopPackagesList called");

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
            if (hmData === null || hmPackData["packageName"] === null || hmPackData["locale"] !== userLang) {
              console.log("here",hmData);
                commonMethod.scrapePackage(url, userLang).then(commonMethod.saveInMongo).then(function(mongoData) {
                    var tempObjId = {};
                    console.log("packageName:",packageName);
                    tempObjId[packageName] = JSON.stringify({
                        "packageName": packageName,
                        "ID": mongoData.packageId,
                        "locale": mongoData.locale,
                        "category": mongoData.category,
                        "catId": mongoData.catId
                    });
                    console.log(tempObjId);
                    redisClient.hmset(idStore, tempObjId);
                    resolve(mongoData.data);
                }).catch(function(data) {
                    reject(data.error);
                });

            } else {
                /**return redis cache**/
                console.log("checking for update");
                commonMethod.scrapePackage(url, userLang).then(function(data) {
                    var packInfo = JSON.parse(hmData[packageName]);
                    if(data.category === packInfo.category) {
                        resolve(hmData[packageName]);
                    } else {
                        commonMethod.updateMongo(data, packInfo.ID).then(function(val) {
                          console.log(val);
                            var tempObjId = {};
                            tempObjId[packageName] = JSON.stringify({
                                "packageName": packageName,
                                "ID": val.packageId,
                                "locale": val.locale,
                                "category": val.category,
                                "catId": val.catId
                            });
                            redisClient.hmset(idStore, tempObjId);
                            resolve(tempObjId);
                        });
                    }
                }).catch(function(err){
                  console.log(err);
                })
            }
        });
    });
}
