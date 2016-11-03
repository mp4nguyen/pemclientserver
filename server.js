/**
 * Created by phuongnguyen on 11/01/16.
 */
/*
var connect = require('connect');
var serveStatic = require('serve-static');
console.log(__dirname );
connect().use(serveStatic(__dirname + "/app")).listen(8000);
*/

var express = require('express');
var server = express();
var https = require('https');
var http = require('http');
var fs = require('fs'); //**fs: Handle file system**
console.log(__dirname );

//==========Start configuring for server===============
var ssl_options = {
    pfx: fs.readFileSync('key/star_redimed_com_au.pfx'),
    passphrase: '1234'
}; //**SSL file and passphrase use for server

var httpsServer = https.createServer(ssl_options,server); //**Create server for HTTPS
var httpServer = http.createServer(server);

//server.use('*',express.static(__dirname + "/app"));
server.use(express.static(__dirname + "/app"));
server.use('/bower_components',  express.static(__dirname + '/bower_components'));

server.use('/CreatePosition-ViewController-context-root*',function(req,res,next){
	console.log('request ....');
	res.redirect('/');
});


var httpsPort = 1000;
var httpPort = 8080;

httpsServer.listen(httpsPort,function(){
    console.log("Https Server is running on "+httpsPort);
});

httpServer.listen(httpPort,function(){
    console.log("Http Server is running on "+httpPort);
});
