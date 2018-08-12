// container for all the environments

var environments = {};

// staging (default) environment
environments.staging = {
	'httpPort' : 3000,
	'httpsPort' : 3001,
	'envName' : 'staging',
	'hashingSecret' : 'thisIsASecret',
	'maxChecks' : 5,
	'twilio' : {
		'accountSid' : '',
		'authToken' : '',
		'fromPhone' : ''
	},
	'templateGlobals' : {
		'appName' : 'UptimeChecker',
		'companyName' : 'NotARealCompany INC',
		'yearCreated' : '2018',
		'baseUrl' : 'http://localhost:3000/'
	}

};

// production environment
environments.production = {
	'httpPort' : 5000,
	'httpsPort' : 5001,
	'envName' : 'production',
	'hashingSecret' : 'thisIsAlsoASecret',
	'maxChecks' : 5,
	'twilio' : {
	    'accountSid' : 'ACb32d411ad7fe886aac54c665d25e5c5d',
	    'authToken' : '9455e3eb3109edc12e3d8c92768f7a67',
	    'fromPhone' : '+15005550006'
	}

};

// determine environment passed as terminal arg
var currentEnv = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// check current environment is valid/available
var environmentToExport = typeof(environments[currentEnv]) == 'object' ? environments[currentEnv] : environments.staging;

// export the module
module.exports = environmentToExport;