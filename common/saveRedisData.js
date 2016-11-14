var fs = require('fs'),
    client = require('redis').createClient();

var redisData= {};
 redisData.saveJSONInRedis=function() {
    fs.readFile('./category.json', 'utf8', onFileRead);

    function onFileRead(err, data) {
        if (err) throw err;
        var catPackage = JSON.parse(data);
        client.hmset("catPackage", catPackage);
    }
}
module.exports=redisData;
