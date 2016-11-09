module.exports = function() {
    var express = require('express');
    var bodyParser = require('body-parser');
    var path = require('path');
    var http = require('http');
    var app = express();
    app.set('port', process.env.PORT || 8080);
    app.use(bodyParser.json())
    app.use(express.static(path.join(__dirname, '../ui')));
    app.post('/search', function(req, res) {
        console.log("Searching for:",req.body.string);
        var dc = require("../../app.js");
		dc.search(req.body.string);
        res.send('kbro');
    })
    var server = http.createServer(app);
    var io = require('socket.io').listen(server);

    server.listen(app.get('port'), function() {
        console.log("Server Started.");
    });
    return io;
}();