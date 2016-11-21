var express = require('express');
var router = express.Router();
var commonMethod = require("../common/commonMethod");
var redisClient = require('redis').createClient();
/**POST (request)**/
router.get('/', function(req, res) {
    var data = {};
    data.packages = [
        "com.softwego.lockscreen",
        "us.screen.recorder"
        // "com.hp.hp12c",
        // "com.NatAguilar.settechnician",
        // "net.ddroid.sw2.wface.model",
        // "com.bykup"
    ];
    // for(a=0;a<data.packages.length;a++){
    //
    // }
    iterate(data.packages).then(updatePackage).then(function(data){
    // console.log("loag",data);
  });

    console.log("updateTopPackagesList called");
    res.send("success categoryList");
});
module.exports = router;

function iterate(data){
  return new Promise(function(resolve, reject){
  data.forEach(function(arry){
  resolve(arry);
  });
});
}

function updatePackage(packageName)
{
  console.log(packageName);
  /** Handle Asyn call **/
  return new Promise(function(resolve, reject){
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
          commonMethod.scrapePackage(url, userLang, function(data) {
              if (!data.error) {
                  commonMethod.saveInMongo(data.data, function(mongoData) {
                      if (!mongoData.error) {
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
                           resolve(mongoData.data)
                          // res.send(JSON.stringify(mongoData.data));
                      }
                  });
              } else {
                  reject(data.error);
              }
          });arry
      } else {
          /**return redis cache**/
          console.log("having value");
           resolve(hmData[packageName]);
          // res.send(JSON.stringify(hmData[packageName]));

      }
  });
});
}
