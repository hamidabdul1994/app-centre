var express = require('express');
var router = express.Router();
/**POST (request )**/
router.post('/', function(req, res) {
  try{
  var paramData = req.body;
  var locale_code,time_stamp;
    console.log("syncTopPackagesCategories called");
    res.send("success categoryList");
  }catch(e){
    res.status(400).send("Bad Header body");
  }
});
module.exports = router;
