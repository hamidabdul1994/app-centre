var express = require('express');
var router = express.Router();
var commonMethod = require("../common/commonMethod.js");

/**POST (request )**/
router.post('/', function(req, res) {
  try{
  var paramData = req.body;
  var locale_code,time_stamp;
  locale_code=paramData.locale;
  time_stamp=paramData.timestamp || 0;//1477308028;
  commonMethod.retrieveMongoData(time_stamp).then(function(data){
        res.send(data);
  });
  }catch(e){
    console.log(e);
    res.status(400).send("Bad Header body");
  }
});
module.exports = router;
