/****
File Name:index.js
Created By:Hamid Raza Noori
date:07/11/2016
Purpose:To handle several state for front end, and send the data as a response
****/

var express = require('express'),
    router = express.Router(),
    HashTable = require("../common/hashtable.js"),
    commonMethod = require("../common/commonMethod.js");

if(HashTable.length===0){
    commonMethod.readCategoryJSON(function(data){
      HashTable.setItemObject(JSON.parse(data));
    })
  }


/*** /getAppDetails state is use to give app details to Front End page ***/
router.use('/getAppDetails', require('./getAppDetails.js'));

/*** /getCatagoryType state is use to give app store data to frint End page ***/
router.use('/getCatagoryType', require('./getCatagoryType.js'));

module.exports = router;
