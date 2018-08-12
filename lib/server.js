// SERVER TASK FILE

// dependencies
var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');
var fs = require('fs');
var handlers = require('./handlers');
var helpers = require('./helpers');
var path = require('path');



var server = {};


// HTTP Server
server.httpServer = http.createServer(function(req,res) {
	server.unifiedServer(req,res);
});


server.httpsServerOptions = {
	'key' : fs.readFileSync(path.join(__dirname,'/../https/key.pem')),
	'cert' : fs.readFileSync(path.join(__dirname,'/../https/cert.pem'))
}

// HTTPS Server
server.httpsServer = https.createServer(server.httpsServerOptions,function(req,res) {
	server.unifiedServer(req,res);	
});



// server logic for http and https
server.unifiedServer = function(req,res){
	// parse the Url
	var parsedUrl = url.parse(req.url,true);

	// getting the path and trimming it
	var path = parsedUrl.pathname;
	var trimmedPath = path.replace(/^\/+|\/+$/g,'');

	// getting the query object
	var queryStringObject = parsedUrl.query;

	// getting the HTTP method
	var method = req.method.toLowerCase();

	// getting the headers
	var headers = req.headers;

	// making a new decoder to store the payload, if any
	var decoder = new StringDecoder('utf-8');
	var buffer = '';

	// log the incoming payload from the stream to the buffer
	req.on('data',function(data){
		buffer+=decoder.write(data);
	});

	req.resume();
	req.on('end',function(){
		buffer+=decoder.end();

		// chose a handler if it exists
		var chosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound ; 

		// if request is within the public directory
		chosenHandler = trimmedPath.indexOf('public/') > -1 ? handlers.public : chosenHandler;
			
		// construct the data object to send to the handler
		var data = {
			'trimmedPath' : trimmedPath,
			'queryStringObject' : queryStringObject,
			'method' : method,
			'headers' : headers,
			'payload' : helpers.parseJsonToObject(buffer)
		};

		

		// route the request to the handler
		// handler = function(data,callback)
		chosenHandler(data,function(statusCode,payload,contentType){

			// determine the type of response
			contentType = typeof(contentType) == 'string' ? contentType : 'json';

			// use the status code called back by the handler, or default to 200
			statusCode = typeof(statusCode) == 'number' ? statusCode : 200;


			// return the response-parts which are content specific
			var payloadString = '';
			if(contentType == 'json') {
				res.setHeader('Content-Type','application/json');
				payload = typeof(payload) == 'object' ? payload : {};
				payloadString = JSON.stringify(payload);
			}
			if(contentType == 'html') {
				res.setHeader('Content-Type','text/html');
				payloadString = typeof(payload) == 'string' ? payload : '';
			}
			if(contentType == 'favicon') {
				res.setHeader('Content-Type','image/x-icon');
				payloadString = typeof(payload) !== 'undefined' ? payload : '';
			}
			if(contentType == 'css') {
				res.setHeader('Content-Type','text/css');
				payloadString = typeof(payload) !== 'undefined' ? payload : '';
			}
			if(contentType == 'png') {
				res.setHeader('Content-Type','image/png');
				payloadString = typeof(payload) !== 'undefined' ? payload : '';
			}
			if(contentType == 'jpg') {
				res.setHeader('Content-Type','image/jpeg');
				payloadString = typeof(payload) !== 'undefined' ? payload : '';
			}
			if(contentType == 'plain') {
				res.setHeader('Content-Type','text/plain');
				payloadString = typeof(payload) !== 'undefined' ? payload : '';
			}

			// return the response-parts which are common to all content
			 
			res.writeHead(statusCode);
			res.end(payloadString);

			if(statusCode == 200) {
				console.log('\x1b[32m%s\x1b[0m',method.toUpperCase()+' /'+trimmedPath+' '+statusCode);
			} else {
				console.log('\x1b[36m%s\x1b[0m',method.toUpperCase()+' /'+trimmedPath+' '+statusCode);
			}

		});	
	});
}


server.router = {
	'' : handlers.index,
	'account/create' : handlers.accountCreate,
	'account/edit' : handlers.accountEdit,
	'account/deleted' : handlers.accountDeleted,
	'session/create' : handlers.sessionCreate,
	'session/deleted' : handlers.sessionDeleted,
	'checks/all' : handlers.checkList,
	'checks/create' : handlers.checksCreate,
	'checks/edit' : handlers.checksEdit,
	'ping' : handlers.ping,
	'api/users' : handlers.users,
	'api/tokens' : handlers.tokens,
	'api/checks' : handlers.checks,
	'favicon.ico' : handlers.favicon,
	'public' : handlers.public
}

// INIT script
server.init = function() {
	
	// start the server
	server.httpServer.listen(config.httpPort,function(){
		console.log('\x1b[36m%s\x1b[0m','The server is listening on port '+config.httpPort);
	});

	// start the https server
	server.httpsServer.listen(config.port,function(){
		console.log('\x1b[34m%s\x1b[0m','The server is listening on port '+config.httpsPort);
	});
};

// export the server
module.exports = server;