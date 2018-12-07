// Helper functions

// dependencies 
const crypto = require('crypto');
const config = require('./config');
const querystring = require('querystring');
const https = require('https');
const path = require('path');
const fs = require('fs');

// container for all the helpers
var helpers = {};

// create a SHA256 hash
helpers.hash = function(str){
	if(typeof(str)=='string' && str.length > 0) {
		var hash = crypto.createHmac('sha256',config.hashingSecret).update(str).digest('hex');
		return hash;
	} else {
		return false;
	}
};

// Parse a JSON string to an object in ALL CASES (even when string might not be valid JSON)
helpers.parseJsonToObject = function(str){
	try{
		var obj = JSON.parse(str);
		return obj;
	} catch(e) {
		return {};
	}
}

// create a string of random alphanumeric characters of a given length
helpers.createRandomString = function(strLength) {
	strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
	if(strLength) {

		// define all possible characters
		var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

		// start the string
		var str = '';

		// get a random character and append it to a string
		for(i = 0; i < strLength; i++) {
			// get a random character
			var randomChar = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));

			// append it to 'str'
			str+=randomChar;
		}

		return str;
	} else {
		return false;
	}
}

helpers.sendTwilioSms = function(phone,msg,callback) {

	// validate the parameters
	phone = typeof(phone) == 'string' && phone.trim().length == 10 ? phone.trim() : false;
	msg = typeof(msg) == 'string' && msg.trim().length <= 160 ? msg.trim() : false;

	if(phone && msg) {

		// configure the request payload
		var payload = {
			'From' : config.twilio.fromPhone,
			'To' : '+1'+phone,
			'Body' : msg
		};

		var stringPayload = querystring.stringify(payload);

		// configure the request details
		var requestDetails = {
			'protocol' : 'https:',
			'hostname' : 'api.twilio.com',
			'method' : 'POST',
			'path' : '/2010-04-01/Accounts' + config.twilio.accountSid + '/Messages.json',
			'auth' : config.twilio.accountSid+':'+config.twilio.authToken,
			'headers' : {
				'Content-Type' : 'application/x-www-form-urlencoded',
				'Content-Length' : Buffer.byteLength(stringPayload)
			}
		};

		// Instantiate the request object
		var req = https.request(requestDetails,function(res){

			// grabe the status of sent request
			var status = res.statusCode;

			// callback succesfully if request goes through
			if(status == 200 || status == 201) {
				callback(false);
			} else {
				callback('Status code returned was '+status);
			}
		});

		// bind to the error event so it doesn't get thrown
		req.on('error',function(e){
			callback(e);
		});

		// add the payload
		req.write(stringPayload);
		req.end();


	} else {
		callback('Parameters missing or invalid');
	}
};

// Get the string content of a template
helpers.getTemplate = function(templateName, data, callback) {

	templateName = typeof(templateName) == 'string' && templateName.length > 0 ? templateName : false;
	data = typeof(data) == 'object' && data!== null ? data : {};

	if(templateName) {
		var templatesDir = path.join(__dirname,'/../templates/');
		fs.readFile(templatesDir+templateName+'.html','utf8',function(err,str){
			if(!err && str && str.length > 0) {
				// str contains the html 
				var finalString = helpers.interpolate(str,data);
				callback(false,finalString);
			} else {
				callback('No template could be found');
			}
		});
	} else {
		callback('A valid template name was not specified');
	}
};

// add the universal _header and _footer to a string, and pass provided 
// data objects
helpers.addUniversalTemplates = function(str, data, callback) {

	str = typeof(str) == 'string' && str.length > 0 ? str : '';
	data = typeof(data) == 'object' && data !== null ? data : {};

	// get the header 
	helpers.getTemplate('_header',data,function(err, headerString){
		if(!err && headerString) {
			// get the footer
			helpers.getTemplate('_footer',data,function(err,footerString){
				if(!err && footerString) {
					// add them all together
					var fullString = headerString + str + footerString;
					callback(false,fullString);
				} else {
					callback('Could not find the footer template');
				}
			});
		} else {
			callback('Could not find the header template');
		}
	});
};

// take a fiven string and a data object and find/replace all the keys
// USEFUL FUNCTION : str.replace()
helpers.interpolate = function(str,data) {
	str = typeof(str) == 'string' && str.length > 0 ? str : '';
	data = typeof(data) == 'object' && data !== null ? data : {};

	// add the templateGlobals to the data object and then replace
	for(var keyName in config.templateGlobals) {
		if(config.templateGlobals.hasOwnProperty(keyName)) {
			data['global.'+keyName] = config.templateGlobals[keyName];
		}
	}

	// for each key in the data object, insert its value
	for(var key in data) {
		if(data.hasOwnProperty(key) && typeof(data[key]) == 'string') {
			var replace = data[key];
			var find = '{' +key+ '}';
			str = str.replace(find,replace);
		}
	}

	return str;
};

helpers.getStaticAsset = function(fileName,callback) {

	fileName = typeof(fileName) == 'string' && fileName.length > 0 ? fileName : false;

	if(fileName) {
		var publicDir = path.join(__dirname,'/../public/');

		fs.readFile(publicDir+fileName,function(err,data){
			if(!err && data) {
				callback(false,data);
			} else {
				callback('No file could be found');
			}
		});
	} else {
		callback('Invalid/NO filename');
	}
};

// export the module
module.exports = helpers;