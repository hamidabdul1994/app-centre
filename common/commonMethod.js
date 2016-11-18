var conn = require("../database/schema");
var fs = require('fs');
var HashTable1 = require("./hashtable");
var request = require("request");
var cheerio = require("cheerio");
var commonMethod = {};

/****** Method to generate Hash Code for storing the Package_id in hashSet ******/
commonMethod.generateHashCode = function(url) {
    var hash = 5387;
    var char;
    for (i = 0; i < url.length; i++) {
        char = url.charCodeAt(i);
        hash = ((hash << 5) + hash) + char; /* (hash will left shift by 5 AND add with actual hash) + char  */
    }
    //Retriving last four digits
    var hashkey = hash.toString();
    var finalhkey = hashkey.substr(hashkey.length - 3, hashkey.length)
    return finalhkey;
};

/******* Method to save Data in MongoDB using schema ************/
commonMethod.saveInMongo = function(objData, callback) {
    var data = new conn.category({
        packageName: objData.title,
        locale:objData.locale,
        GPcategory: objData.GPcategory,
        category: objData.category
    });
    /**
     * save data in database
     * @return {successfully uploaded}
     **/
    data.save(function(error, result) {
        result['catId']=objData.catId;
        if (error) {
            callback({
                "error": error
            })
        } else {
            callback({
                "data": result
            });
        }
    });
};

/******* Method is use to Scrape the package data and callback to caller   ******/
commonMethod.scrapePackage = function(url,locale, callback) {
    request(url, function(error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);
            /***** Code is checking whether Package Name is correct or not *****/
            if ($("#error-section").length === 0) {
                var objData = {};
                objData.title = $(".id-app-title").text();
                objData.GPcategory = $('.category').children().first().text();
                objData.locale=locale;
                objData.category = HashTable1.getItem(objData.GPcategory).CatName;
                objData.catId = HashTable1.getItem(objData.GPcategory).CatId;
                // commonMethod.saveInMongo(objData);
                callback({
                    "data": objData
                });
            } else {
                callback({
                    "error": "Package Name is incorrect!!!"
                });
            }

        }
    });
};

/****** Method to read package category JSON data********/
commonMethod.readCategoryJSON = function(callback) {
    fs.readFile('./category.json', 'utf8', function(err, data) {
        if (err) throw err;
        callback(data);
    });
};
module.exports = commonMethod;
