var net = require('net');
var log = require('./log');
var commandLineArgs = require('command-line-args');
var options = commandLineArgs([{
        name: 'params',
        alias: 'p',
        type: String,
        multiple: true,
        defaultOption: true
}]);

console.log(options);

function magic() {

        var HOST = '172.16.71.71';
        var PORT = 411;
        var client = new net.Socket();

        this.state = {
                "connected": false,
                "hub address": null,
                "logging": false
        };

        this.connect = function(HOST, PORT) {

                client.connect(PORT, HOST, function() {

                        this.state.connected = true;
                        this.state["hub address"] = HOST + ':' + PORT;
                        console.log(this.state);

                }.bind(this));

                client.on('data', function(data) {

                        data = data.toString();

                        if (this.state.logging)
                                log(data);

                        var responseContainsLock = data.includes('$Lock'),
                                responseContainsHello = data.includes('$Hello'),
                                responseContainsNickList = data.includes('$HubName'),
                                responseContainsSearchResults = data.includes('$SR');

                        if (responseContainsLock) {
                                client.write("$Supports NoHello |");
                                client.write('$Key ' + lock2key(data.toString()) + '|');
                                client.write("$ValidateNick " + options.params[0] + "|");
                        }

                        if (responseContainsHello) {
                                client.write("$Version 0.1|");
                                client.write("$MyINFO $ALL " + options.params[0] + " <++ V:0.1,M:P,H:1/0/0,S:4>$ $0.1.\u0001$$" + options.params[1] + "$");
                                client.write("$GetNickList|");
                        }

                        if (responseContainsNickList) {
                                console.log("Magic: Logged In");
                                setTimeout(function() { this.search("Porcupine Tree") }.bind(this), 1000);
                        }

                        if (responseContainsSearchResults) {
                                console.log(data.split('$SR'));
                        }
                        return false;
                }.bind(this));

                client.on('close', function() {
                        console.log('Connection closed');
                });

        }

        this.search = function(query) {
                var search_string = "$Search Hub:" + options.params[0] + " F?F?0?1?" + query.replace(" ","$") + "|";
                client.write(search_string);
        }

        this.disconnect = function() {

        }
}

var dc = new magic();
dc.connect('172.16.71.71', 411);


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
