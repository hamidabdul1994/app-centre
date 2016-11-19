var express = require('express');
var router = express.Router();
/**POST (request )**/
router.get('/', function(req, res) {
    console.log("syncTopPackagesCategories called");
    res.send("success categoryList");
});
module.exports = router;
