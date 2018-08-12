const http = require('http');

var httpServer = http.createServer(function(req,res){
	console.log('ITS ALIVE, you just recieved a request');
	res.end('Rish!');
});

httpServer.listen(3000,function(){
	console.log('Server started');
});