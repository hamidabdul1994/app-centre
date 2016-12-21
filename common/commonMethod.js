var conn = require("../database/schema");
var fs = require('fs');
var HashTable1 = require("./hashtable");
var request = require("request");
var cheerio = require("cheerio");
var crypto = require('crypto');
var commonMethod = {};


/****** Method to generate Hash Code for storing the Package_id in hashSet ******/
commonMethod.generateHashCode = function(packageName) {
    var hashkey = crypto.createHash('md5').update(packageName).digest("hex");
    var finalhkey = hashkey.substr(hashkey.length - 3, hashkey.length);
    return finalhkey;
};

/******* Method to save Data in MongoDB using schema ************/
commonMethod.saveInMongo = function(objData) {
    var data = new conn.category({
        packageName: objData.packageName,
        locale: objData.locale,
        categoryId:objData.catId,
        GPcategory: objData.GPcategory,
        category: objData.category
    });

    return new Promise(function(resolve, reject) {
        /**
         * save data in database
         * @return {successfully uploaded}
         **/
        data.save(function(error, result) {
            result['catId'] = objData.catId;
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });

    })

};

/****** Method is use to update package and make packageStatus modified  *****/
commonMethod.updateMongo = function(objData, p_id) {
    return new Promise(function(resolve, reject) {
        conn.category.update({
            "packageId": p_id
        }, {$set:{
            "GPcategory": objData.GPcategory,
            "categoryId":objData.catId,
            "category": objData.category,
            "packageStatus":"package_modified",
            "timestamp": Date.now()
        }}, function(err, data) {

            if (err) {
                reject(err)
            }else {
            resolve(data);
            }

        });

    });
};

/****** Method is sync the data from last timestamp updated (client timestamp) to recent uploaded packages *******/
commonMethod.retrieveMongoData = function(timestamp){
  return new Promise(function(resolve, reject) {
        var tempObj ={};
        tempObj.time_stamp=timestamp;
        timestamp*=1000;
        var call1 = findData(timestamp,"package_added").then(function(data){
          tempObj[data.packageStatus]=data.data;
        });

        var call2 = findData(timestamp,"package_modified").then(function(data){
          tempObj[data.packageStatus]=data.data;
        })
        Promise.all([call1,call2]).then(function(){
          resolve(tempObj);
        }).catch(function(error){
          reject(error);
        })
      });

}
/***** Method to retrive the mongoData  ****/
var findData = function(timeData,packageStatus){
  return new Promise(function(resolve, reject) {
    conn.category.find({"timestamp":{$gte:timeData},packageStatus},function(err,objData){
      var temp =[];
      if(objData){
        if(objData.length>0)
        {
          objData.forEach(function(mongData,i){
            temp.push({package_name:mongData.packageName,category_id:mongData.categoryId,category_name:mongData.category});
          })

      }else {
        temp=[];
      }
        resolve({"data":temp,packageStatus});
      }else {
        reject(err);
      }
  });
})
}

/******* Method is use to Scrape the package data and callback to caller   ******/
commonMethod.scrapePackage = function(url, locale,packageName) {
    return new Promise(function(resolve, reject) {
        request(url, function(error, response, html) {
            if (!error) {
                var $ = cheerio.load(html);
                /***** Code is checking whether Package Name is correct or not *****/
                if ($("#error-section").length === 0) {
                    var objData = {};
                    objData.title = $(".id-app-title").text();
                    objData.packageName=packageName;
                    objData.GPcategory = $('.category').children().first().text();
                    objData.locale = locale;
                    objData.category = HashTable1.getItem(objData.GPcategory).CatName; /*JSON have different format*/
                    objData.catId = HashTable1.getItem(objData.GPcategory).CatId;
                    resolve(objData);
                } else {
                    reject({
                        "error": "Package Name is incorrect!!!"
                    });
                }
            }
        });
    })

};

/****** Method to read package category JSON data********/
commonMethod.readCategoryJSON = function(fileName, callback) {
    fs.readFile(fileName, 'utf8', function(err, data) {
        if (err) throw err;
        callback(data);
    });
};
module.exports = commonMethod;
