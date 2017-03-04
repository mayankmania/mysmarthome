var express = require('express');
var app = new express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
http.listen(process.env.PORT || 9000);
startUp();

io.on('connection', function (socket) {
    socket.on('operationProcessed', function (operation) {
        if (operation.description == "get") {
            io.emit("deviceListFetched", operation.deviceDetails);
        }
        else if (operation.description == "post") {
            io.emit("onDeviceUpdated", operation.deviceDetails[0]);
        }
    });

    socket.on('performOperation', function (data) {
        io.emit("processRecord", { raspId: data.raspId, description: "post", deviceId: data.deviceId, isProcessed: false });
    });

    socket.on('getDevices', function (raspId) {
        io.emit("processRecord", { raspId: raspId, description: "get", deviceId: "0", isProcessed: false });
    });
});


function startUp() {
    var options = {
        index: "index.htm"
    };

    app.use('/', express.static('public', options));
}