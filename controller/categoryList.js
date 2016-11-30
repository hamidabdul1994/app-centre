var bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();
var commonMethod = require("../common/commonMethod.js");


/**POST (request locale)**/
router.post('/', function(req, res) {
    try {
        commonMethod.readCategoryJSON("./categoryLocale.json", function(data) {
            res.send(data);
        });
    } catch (e) {
        res.status(400).send("Bad Header body");
    }

});
module.exports = router;
