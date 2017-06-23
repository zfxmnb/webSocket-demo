var path = require('path');
var url = require('url');
//var fs = require('fs');
var getFile = require('../router').getFile;
var route = {};

route.get = function(req, res) {
    var data = req.query;
    res.write(JSON.stringify(data));
    res.end();
}
route.post = function(req, res) {
    var data = req.query;
    res.write(JSON.stringify(req.query));
    res.end();
}
module.exports = route;
