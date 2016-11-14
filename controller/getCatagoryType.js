var bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();
router.get('/', function(req, res) {
  console.log("getCategoryType called");
  res.send("success getCatagoryType");
});
module.exports=router;
