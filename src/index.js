var net = require('net');

var HOST = '172.16.71.71';
var PORT = 411;

var commandLineArgs = require('command-line-args');
var options = commandLineArgs([{
  name: 'nick',
  alias: 'n',
  type: String,
  multiple: false,
  defaultOption: true
}, ]);

console.log(options);
var client = new net.Socket();
client.connect(PORT, HOST, function () {

  console.log('CONNECTED TO: ' + HOST + ':' + PORT);
  // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
});

// Add a 'data' event handler for the client socket
// data is what the server sent to this socket
client.on('data', function (data) {

  console.log('DATA: ' + data);
  // Close the client socket completely
  var responseContainsLock = data.indexOf('$Lock');
  var message;
  if (responseContainsLock >= 0) {
    client.write("$Supports UserCommand UserIP2 TTHSearch ZPipe0 GetZBlock |");
    message = '$Key ' + lock2key(data.toString()) + '|';
    console.log(message);
    client.write(message);
    client.write("$ValidateNick " + options.nick + "|");
  }

  var responseContainsHello = data.indexOf('$Hello');
  if (responseContainsHello >= 0) {
    message = "$MyINFO $ALL " + options.nick + " <++ V:0.1,M:P,H:1/0/0,S:4>$ $0.1.\u0001$$12178713844$";
    console.log(message);
    client.write("$Version 0.1|");
    client.write(message);
    client.write("$GetNickList|");
    //client.write("Fuck you too.");
  }
  return false;
});

// Add a 'close' event handler for the client socket
client.on('close', function () {
  console.log('Connection closed');
});


/*
	Encoding lock parameter sent by Hub 
	to a pass key for the current session
*/

function nibbleswap(bits) {
  return ((bits << 4) & 240) | ((bits >>> 4) & 15);
}

function chr(b) {
  return (("..0.5.36.96.124.126.").indexOf("." + b + ".") > 0) ? "/%DCN" + (0).toPrecision(4 - b.toString().length).substr(2) + b + "%/" : String.fromCharCode(b);
}

function lock2key(lock) {
  var key = chr(nibbleswap(lock.charCodeAt(0) ^ lock.charCodeAt(-1) ^ lock.charCodeAt(-2) ^ 5));
  for (var i = 1; i < lock.length; i++) {
    key += chr(nibbleswap(lock.charCodeAt(i) ^ lock.charCodeAt(i - 1)));
  }
  return key;
}
