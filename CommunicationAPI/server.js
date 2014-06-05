/* simple piece of js invoked by node for locally serving op web pages */
var connect = require("connect");
connect().use(connect.static(__dirname)).listen(8080);
console.log("listening to 8080");
