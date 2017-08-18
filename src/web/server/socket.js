// var io = require('./server');
// var handleClient = function (socket) {
// 	    console.log("Yay. Client!");
// 	    //socket.emit("live", "hello world");
// 	    io.sockets.emit("live", "hello world 2");
// 	    //callback(socket);
// 	};
// io.on("connection", handleClient);

module.exports = function () {
  var io = require('./server');
  var emit = function (title, data) {
    return io.sockets.emit(title, data);
  };
  return {
    emit: emit,
  };
}();
