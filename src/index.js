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

        var client = new net.Socket();
        var results = [];

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
                                responseContainsSearchResults = data.includes('$SR'),
                                responseContainsConnectToMe = data.includes('$ConnectToMe');

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
                                setTimeout(function() {
                                        this.search("Blackest Eyes");
                                }.bind(this), 1000);
                        }

                        if (responseContainsSearchResults) {
                                results.push(data.split('$SR ').filter(function(item) {
                                        if (item.split('\x05').length == 3)
                                                return true;
                                        else
                                                return false;
                                }).map(function(item) {
                                        item = item.split('\x05');
                                        var row = new Object();
                                        row.user = item[0].split('\\')[0].split(' ')[0];
                                        row.filename = item[0].split('\\').pop();
                                        row.size = parseInt(item[1].split(' ')[0]);
                                        row.slots = parseInt(item[1].split(' ').pop().split('/')[0]);
                                        row.address = item[0].slice(item[0].indexOf(' ') + 1);
                                        return row;
                                }));
                                results.sort(function(a, b) {
                                        if (b.slots > a.slots)
                                                return 1;
                                        else
                                                return -1;
                                });
                                console.log("hello", results[0][0]);
                        }

                        if (responseContainsConnectToMe) {
                                // console.log('Connection Acknowledged: ', data);
                        }
                        return false;
                }.bind(this));

                client.on('close', function() {
                        console.log('Connection closed');
                });

        };

        this.search = function(query) {
                var search_string = "$Search Hub:" + options.params[0] + " F?F?0?1?" + query.replace(" ", "$") + "|";
                client.write(search_string);
        };

        this.download = function(index) {

        }

        this.disconnect = function() {

        };
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

//https://www.youtube.com/watch?v=z9BL59uiAz8&list=PLBKadB95sF44vjNzNABcYoF_7ae6lAgJM
