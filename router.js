var fs = require('fs');
var path = require('path');
var url = require('url');
var querystring = require('querystring');

var mine = {
    "css": "text/css",
    "gif": "image/gif",
    "html": "text/html",
    "ico": "image/x-icon",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "js": "text/javascript",
    "json": "application/json",
    "pdf": "application/pdf",
    "png": "image/png",
    "svg": "image/svg+xml",
    "swf": "application/x-shockwave-flash",
    "tiff": "image/tiff",
    "txt": "text/plain",
    "wav": "audio/x-wav",
    "wma": "audio/x-ms-wma",
    "wmv": "video/x-ms-wmv",
    "xml": "text/xml"
};

var router = {};

router.path = function(entry, path, req, res) {
    if (!path) {
        switch (req.method) {
            case "GET":
                req.query = querystring.parse(url.parse(req.url).query);
                entry.get(req, res);
                return false;
                break;
            case "POST":
                var postData = "";
                req.addListener("data", function(data) {
                    postData += data;
                });
                req.addListener("end", function() {
                    req.query = querystring.parse(postData);
                    entry.post(req, res);
                });
                return false;
                break;
            default:
                return path;
        }
    } else {
        return path;
    }
}
router.getFile = function(realPath, pathname, request, response) {
    fs.exists(realPath, function(exists) {
        if (!exists) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });
            response.write("This request URL " + pathname + " was not found on this server.");
            response.end();
        } else {
            var ext = path.extname(realPath);
            ext = ext ? ext.slice(1) : 'unknown';
            fs.readFile(realPath, "binary", function(err, file) {
                if (err) {
                    response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    response.end(err);
                } else {
                    var contentType = mine[ext] || "text/plain";
                    response.writeHead(200, {
                        'Content-Type': contentType
                    });
                    response.write(file, "binary");
                    response.end();
                }
            });
        }
    });
}
module.exports = router;
