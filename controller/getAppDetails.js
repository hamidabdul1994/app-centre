var bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();
router.get('/', function(req, res) {
  console.log("Get called");
}); 
module.exports=router;
