var bodyParser = require('body-parser');
var express = require('express');
var cheerio = require("cheerio");
var request = require("request");
var router = express.Router();
var client = require('redis').createClient();

router.get('/:url', function(req, res) {
  console.log("Get called");
  var urlData = req.params.url;
  var url="https://play.google.com/store/apps/details?id="+urlData;
  request(url,function(error,response,html){
    if(!error){
      var $ = cheerio.load(html);
      /***** Code is checking url is correct or not *****/
      if($("#error-section").length ===0)
      {
        // $('.document-title').filter(function(){
        //   var data=$(this);
        //   console.log("Title::",data.children().first().text());
        //   res.send("Title::"+data.children().first().text());
        // })
        //,'.primary'
        var objData={};
        objData.title=$(".id-app-title").text();
        objData.GPcategory=$('.document-subtitle span[itemprop="genre"]').text();
        // console.log($('.document-subtitle span[itemprop="genre"]'));
        $('.document-subtitle span[itemprop="genre"]').filter(function(){
            var data=$(this);
              console.log("data",data.text());
        })

        var Data=client.hgetall("catPackage",function(error,reply){
          objData.category=reply[objData.GPcategory];
          res.send(JSON.stringify(objData));
        });
        // $('div.document-subtitle span[itemprop='genre']').filter(function(){
        //   var data1=$(this);
        //   console.log(data1.next("span[itemprop='genre']").children());
        //   console.log("category name::",data1.children().first().text());
        // })
      }else{
        console.log("url Wrong, enter correct one");
        res.send("URL is incorrect!!!");
      }

    }
  });
});
module.exports=router;

function retrieveGPData(){
  var title;

}
