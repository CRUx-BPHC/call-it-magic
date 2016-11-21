var magic = require('./nmdc/index.js');
var dc = new magic();
dc.connect('172.16.115.31', 411);
module.exports = dc;