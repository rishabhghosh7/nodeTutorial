/* 

   CLI File

   */



// dependencies
var readline = require('readline');
var util = require('util');
var debug = util.debuglog('cli');
var events = require('events');
class _events extends events{};
var e = new _events();

// instantiate the cli module object

var cli = {};

// INPUT HANDLERS
e.on('man',function(str){
	cli.responders.help();
});

e.on('help',function(str){
	cli.responders.help();
});

e.on('exit',function(str){
	cli.responders.exit();
});

e.on('stats',function(str){
	cli.responders.stats();
});

e.on('list users',function(str){
	cli.responders.listUsers();
});

e.on('more user info',function(str){
	cli.responders.moreUserInfo(str);
});

e.on('more check info',function(str){
	cli.responders.moreCheckInfo(str);
});

e.on('list logs',function(str){
	cli.responders.listLogs();
});

e.on('more log info',function(){
	cli.responders.moreLogInfo(str);
});

cli.responders = {};

// Help / Man
cli.responders.help = function(){
	console.log("You asked for help");
};

// Exit
cli.responders.exit = function(){
	process.exit(0);
};

// Stats
cli.responders.stats = function(){
	console.log("You asked for stats");
};

// List Users
cli.responders.listUsers = function(){
	console.log("You asked to list users");
};

// More user info
cli.responders.moreUserInfo = function(str){
	console.log("You asked for more user info",str);
};

// List Checks
cli.responders.listChecks = function(){
	console.log("You asked to list checks");
};

// More check info
cli.responders.moreCheckInfo = function(str){
	console.log("You asked for more check info",str);
};

// List Logs
cli.responders.listLogs = function(){
	console.log("You asked to list logs");
};

// More logs info
cli.responders.moreLogInfo = function(str){
	console.log("You asked for more log info",str);
};




cli.processInput = function(str) {
	str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : false;

	if(str) {
		// create tokens for valid questions?
		var uniqueInputs = [
			'man',
			'help',
			'exit',
			'stats',
			'list users',
			'more user info',
			'list checks',
			'more checks info',
			'list logs',
			'more log info'
		];

		// go through the possible inputs, emit event for valid event
		var matchFound = false;
		var counter = 0;
		uniqueInputs.some(function(input){
			if(str.toLowerCase().indexOf(input) > -1) {
				matchFound = true;
				// emit event matching unique input and include whole string given
				e.emit(input,str);
				return true;
			}
		});

		// no match found == invalid command
		if(!matchFound) {
			console.log('Sorry, try again'); 
		}
	}
};

// init script 
cli.init = function(){
	console.log('The CLI is running');

	// start the interface
	var _interface = readline.createInterface({
		input : process.stdin,
		output : process.stdout,
		prompt : '>'
	});

	// create intial prompt
	_interface.prompt();

	// handle each line seperately
	_interface.on('line',function(str){

		// send to the input processor
		cli.processInput(str);

		_interface.prompt();
	});

	// handle each line seperately
	_interface.on('close',function(str) {
		process.exit(0);
	});
};


module.exports = cli;
