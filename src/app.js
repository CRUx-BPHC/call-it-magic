var magic = require('./nmdc/index.js');
var dc = new magic();
dc.connect('172.16.71.71', 411);
module.exports = dc;