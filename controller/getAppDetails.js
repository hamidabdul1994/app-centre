var bodyParser = require('body-parser');
var express = require('express');
var cheerio = require("cheerio");
var request = require("request");
var router = express.Router();
var client = require('redis').createClient();
var conn = require("../database/schema")

router.get('/:url', function(req, res) {
    console.log("Get called");
    var urlData = req.params.url;
    var url = "https://play.google.com/store/apps/details?id=" + urlData;
    request(url, function(error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);
            /***** Code is checking url is correct or not *****/
            if ($("#error-section").length === 0) {
                // $('.document-title').filter(function(){
                //   var data=$(this);
                //   console.log("Title::",data.children().first().text());
                //   res.send("Title::"+data.children().first().text());
                // })
                //,'.primary'   span[itemprop="genre"]
                console.log("URL correct");
                var objData = {};
                objData.title = $(".id-app-title").text();
                objData.GPcategory = $('.category').children().first().text();
                // console.log($('.document-subtitle span[itemprop="genre"]'));
                // $('.document-subtitle span[itemprop="genre"]').filter(function(){
                //     var data=$(this);
                //       console.log("data",data.text());
                // })

                var Data = client.hgetall("catPackage", function(error, reply) {
                    objData.category = reply[objData.GPcategory];
                    saveInMongo(objData);
                    res.send(JSON.stringify(objData));
                });
            } else {
                console.log("url Wrong, enter correct one");
                res.send(JSON.stringify({"error":"URL is incorrect!!!"}));
            }

        }
    });
});
module.exports = router;
function saveInMongo(objData){
  var data = new conn.category({
                cat_id: 100,
                cat_name: objData.title,
                GPcategory: objData.GPcategory,
                category: objData.category
            });
            /**
             * save data in database
             * @return {successfully uploaded}
             */
            data.save(function(error, result) {
                if (error) {
                    console.log(error);
                } else {
                  console.log("success mongo");
                }
            });
}
function retrieveGPData() {
    var title;
}
