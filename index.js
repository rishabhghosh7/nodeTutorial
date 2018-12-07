// Primary API file

// Dependencies
const server = require('./lib/server');
const workers = require('./lib/workers');
const cli = require('./lib/cli');

// declare the app
var app = {};

// Init function
app.init = function() {

	// start the server
	server.init();

	// start the workers
	//workers.init();

	// start the cli
	cli.init();
};

// execute
app.init();

// export the app 
module.exports = app;