var bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();
var commonMethod = require("../common/commonMethod.js");


/**POST (request locale)**/
router.post('/', function(req, res) {
  console.log("/categoryList called");

  commonMethod.readCategoryJSON("./categoryLocale.json",function(data){
    // console.log(data);
    res.send(data);
  });
    // res.send("success categoryList");
});
module.exports = router;
