//index.js
var PORT = 8000;
var http = require('http');
var url = require('url');
var path = require('path');
var socket = require('socket.io');
var router = require('./router');
var index = require('./routes/index');
//路由表
var routes = [
    { route: "/", path: "html/websocket.html" },
    { route: "/action", entry: index }
]

var server = http.createServer(function(request, response) {
    var pathname = url.parse(request.url).pathname,
        realPath = path.join(__dirname, pathname);
    //路由
    for (var i = 0; i < routes.length; i++) {
        if (pathname === routes[i].route)
            realPath = router.path(routes[i].entry, routes[i].path, request, response); //path.join(__dirname, routes[i].page);
    }
    console.log(realPath);
    if (realPath) {
        router.getFile(realPath, pathname, request, response);
    };
});
server.listen(PORT);
//websoket server
socketio = function(server) {
    var onlineUsers = {}; //在线用户
    var onlineCount = 0; //当前在线人数
    var io = require('socket.io')(server);
    console.log("socket 启动");
    io.on('connection', function(socket) {
        socket.on('chat', function(from, data) {
            var json = {};
            json.name = onlineUsers[from];
            json.id = from;
            json.data = data;
            console.log(json);
            io.emit('chat', json);
        });
        socket.on('login', function(obj) {
            socket.id = obj.id; //将新加入用户的唯一标识当作socket的名称，后面退出的时候会用到
            if (!onlineUsers.hasOwnProperty(obj.id)) { //检查在线列表，如果不在里面就加入
                onlineUsers[obj.id] = obj.name;
                onlineCount++; //在线人数+1
                obj.onlineCount = onlineCount;
            }
            console.log(obj);
            io.emit('login', obj);

        });
        socket.on('disconnect', function() {
            //将退出的用户从在线列表中删除
            if (onlineUsers.hasOwnProperty(socket.id)) {
                var obj = { id: socket.id, name: onlineUsers[socket.id] }; //退出用户的信息
                delete onlineUsers[socket.id]; //删除
                onlineCount--; //在线人数-1
                obj.onlineCount = onlineCount;
                console.log(obj);
                io.emit('logout', obj);
            }
        })
    });
}
socketio(server);
