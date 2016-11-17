var bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();
router.get('/', function(req, res) {
  console.log("categoryList called");
  res.send("success categoryList");
});
module.exports=router;
