/****
File Name:index.js
Created By:Hamid Raza Noori
date:07/11/2016
Purpose:To handle several state for front end request, and send the data as a response
****/

var express = require('express'),
    router = express.Router(),
    HashTable = require("../common/hashtable.js"),
    commonMethod = require("../common/commonMethod.js");

if (HashTable.length === 0) {
    commonMethod.readCategoryJSON('./category.json',function(data) {
        HashTable.setItemObject(JSON.parse(data));
    });
}

/*** /categoryForPackage state is use to give app details to Front End page ***/
router.use('/categoryForPackage', require('./categoryForPackage.js'));


/*** /categoryList state is use to give app store data to frint End page ***/
router.use('/categoryList', require('./categoryList.js'));

/** /updateTopPackagesList**/
router.use("/updateTopPackagesList", require("./updateTopPackagesList.js"));

/** /syncTopPackagesCategories**/
router.use("/syncTopPackagesCategories", require("./syncTopPackagesCategories.js"));

module.exports = router;
