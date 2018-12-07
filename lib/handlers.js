// dependencies
const _data = require('./data');
const helpers = require('./helpers');
const config = require('./config');
const https = require('https');
const querystring = require('querystring');

// define the handlers
var handlers = {};

/* 
	HTML HANDLERS 
*/

// Index Handler
handlers.index = function(data,callback) {
	
	// reject any request that isnt a GET
	if(data.method == 'get') {

		// prepare data for interpolation
		var templateData = {
			'head.title' : 'Rish!',
			'head.description' : 'This is a meta description',
			'body.title' : 'Hello templated world!',
			'body.class' : 'index'
		};

		// read in a template as a string
		helpers.getTemplate('index',templateData,function(err,str){
			if(!err && str) {
				// add header and footer
				helpers.addUniversalTemplates(str,templateData,function(err,str){
					if(!err && str) {
						callback(200,str,'html');
					} else {
						callback(500,undefined,'html');
					}
				});
			} else {
				callback(500,undefined,'html');
			}
		});
	} else {
		callback(405,undefined,'html');
	}
}

// create account handler
handlers.accountCreate = function(data,callback) {
	// reject any request that isnt a GET
	if(data.method == 'get') {

		// prepare data for interpolation
		var templateData = {
			'head.title' : 'Create a new account',
			'head.description' : 'Signup takes a few seconds'
		};

		// read in a template as a string
		helpers.getTemplate('accountCreate',templateData,function(err,str){
			if(!err && str) {
				// add header and footer
				helpers.addUniversalTemplates(str,templateData,function(err,str){
					if(!err && str) {
						callback(200,str,'html');
					} else {
						callback(500,undefined,'html');
					}
				});
			} else {
				callback(500,undefined,'html');
			}
		});
	} else {
		callback(405,undefined,'html');
	}
};

// Login/ Session creation controller
handlers.sessionCreate = function(data,callback) {
	// reject any request that isnt a GET
	if(data.method == 'get') {

		// prepare data for interpolation
		var templateData = {
			'head.title' : 'Login',
			'head.description' : 'Enter phone and password to login'
		};

		// read in a template as a string
		helpers.getTemplate('sessionCreate',templateData,function(err,str){
			if(!err && str) {
				// add header and footer
				helpers.addUniversalTemplates(str,templateData,function(err,str){
					if(!err && str) {
						callback(200,str,'html');
					} else {
						callback(500,undefined,'html');
					}
				});
			} else {
				callback(500,undefined,'html');
			}
		});
	} else {
		callback(405,undefined,'html');
	}
};

handlers.sessionDeleted = function(data,callback) {
	// reject any request that isnt a GET
	if(data.method == 'get') {

		// prepare data for interpolation
		var templateData = {
			'head.title' : 'Login to your account',
			'head.description' : 'Enter phone and password to login'
		};

		// read in a template as a string
		helpers.getTemplate('sessionDeleted',templateData,function(err,str){
			if(!err && str) {
				// add header and footer
				helpers.addUniversalTemplates(str,templateData,function(err,str){
					if(!err && str) {
						callback(200,str,'html');
					} else {
						callback(500,undefined,'html');
					}
				});
			} else {
				callback(500,undefined,'html');
			}
		});
	} else {
		callback(405,undefined,'html');
	}
};

handlers.accountEdit = function(data,callback) {
	// reject any request that isnt a GET
	if(data.method == 'get') {

		// prepare data for interpolation
		var templateData = {
			'head.title' : 'Account Settings',
			'body.class' : 'accountEdit'
		};

		// read in a template as a string
		helpers.getTemplate('accountEdit',templateData,function(err,str){
			if(!err && str) {
				// add header and footer
				helpers.addUniversalTemplates(str,templateData,function(err,str){
					if(!err && str) {
						callback(200,str,'html');
					} else {
						callback(500,undefined,'html');
					}
				});
			} else {
				callback(500,undefined,'html');
			}
		});
	} else {
		callback(405,undefined,'html');
	}
};

handlers.accountDeleted = function(data,callback) {
	// reject any request that isnt a GET
	if(data.method == 'get') {

		// prepare data for interpolation
		var templateData = {
			'head.title' : 'Goodbye',
			'head.description' : 'We hope to see you again :(',
			'body.class' : 'accountDeleted'
		};

		// read in a template as a string
		helpers.getTemplate('accountDeleted',templateData,function(err,str){
			if(!err && str) {
				// add header and footer
				helpers.addUniversalTemplates(str,templateData,function(err,str){
					if(!err && str) {
						callback(200,str,'html');
					} else {
						callback(500,undefined,'html');
					}
				});
			} else {
				callback(500,undefined,'html');
			}
		});
	} else {
		callback(405,undefined,'html');
	}
};

handlers.checksCreate = function(data,callback) {
	// reject any request that isnt a GET
	if(data.method == 'get') {

		// prepare data for interpolation
		var templateData = {
			'head.title' : 'New Check',
			'head.description' : 'Create a new check',
			'body.class' : 'chekcsCreate'
		};

		// read in a template as a string
		helpers.getTemplate('checksCreate',templateData,function(err,str){
			if(!err && str) {
				// add header and footer
				helpers.addUniversalTemplates(str,templateData,function(err,str){
					if(!err && str) {
						callback(200,str,'html');
					} else {
						callback(500,undefined,'html');
					}
				});
			} else {
				callback(500,undefined,'html');
			}
		});
	} else {
		callback(405,undefined,'html');
	}
};


/* 
	JSON API HANDLERS 
*/



// create container for token submethods
handlers._tokens = {};

/*
Determines if the AUTH token on the user header is 
	registered with the user's phone AND if it is valid.
ELI5 - Checks if user is logged on / authenticated.
*/
handlers._tokens.verifyToken = function(id,phone,callback) {

	// lookup the token
	_data.read('tokens',id,function(err,tokenData){
		if(!err && tokenData) {

			// check the token is for given user (validated by his phone and token hasnt expired)
			if(tokenData.phone == phone && tokenData.expires > Date.now()) {
				callback(true);
			} else {
				callback(false);
			}

		} else {
			callback(false);
		}
	});
};


// Sample handler
handlers.ping = function(data,callback){
	callback(200,{'Ping' : 'Success'});
}

// Not found default handler
handlers.notFound = function(data,callback){
	callback(404);
}

// users
handlers.users = function(data,callback){
	var acceptableMethods = ['post','get','put','delete']
	if(acceptableMethods.indexOf(data.method) > -1) {
		handlers._users[data.method](data,callback);
	} else {
		callback(405,{'Error' : 'Requested method not allowed'});
	}
};

// container for user submethods
handlers._users = {};

// users post
// required data : firstName, lastName, phone, password, tosAgreement
handlers._users.post = function(data,callback) {

	// check all required fields are filled
	var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
	var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
	var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
	var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
	var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? data.payload.tosAgreement : false;
	
	if(firstName && lastName && phone && password && tosAgreement) {
		
		// try opening the file as if the user exists, error is passed if it does not
		_data.read('users',phone,function(err,data){
			
			// error exists so the user does not exist, proceed to create a new user
			if(err){
				
				// hash the password
				var hashedPassword = helpers.hash(password);

				// check if successfully hashed
				if (hashedPassword) {

					// create the user object
					var userObject = {
						'firstName' : firstName,
						'lastName' : lastName,
						'phone' : phone,
						'hashedPassword' : hashedPassword,
						'tosAgreement' : true
					};

					// store the user
					_data.create('users',phone,userObject,function(err){
						if (!err) {

							// no error, SUCCESS !
							callback(200);
						} else {

							// log the error and callback error
							callback(500,{'Error':'Could not create the new user'});
						}
					});
				} else {
					callback(500,{'Error' : 'Could not hash password'});
				}
			} else {
				callback(400,{'Error':'A user with that phone number already exists'});
			}
		});
	} else {
		callback(400,{'Error' : 'Missing required fields'});
	}
	
};

// users get
// Required : phone data
// Optional : NONE
// @TODO make sure only owner can access details
handlers._users.get = function(data,callback) {

	// validate phone number given
	var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
	
	if(phone) {

		// get the token from the header
		var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

		// verify that the given token is valid for the phone number
		handlers._tokens.verifyToken(token,phone,function(tokenIsValid){
			if(tokenIsValid) {

				// phone number exists, proceed and lookup the user
				_data.read('users',phone,function(err,userData){
					if(!err && userData) {

						// remove the hashed password before sending it
						delete userData.hashedPassword;

						// success, callback with the userData
						callback(200,userData);
					} else {
						callback(404);
					}
				});

			} else {
				callback(403,{'Error' : 'Missing required token in header, or invalid token'});
			}
		});

	} else {

		// phone number invalid
		callback(400,{'Error' : 'Invalid phone number'});
	}
};

// users put
// Required data : phone
// optional data : firstName, lastName, password (atleast one)
handlers._users.put = function(data,callback) {

	// check for valid phone number
	var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.trim() : false;
	
	// optional fields

	var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
	var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
	var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
	var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
	var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? data.payload.tosAgreement : false;
	
	if(phone) {

		// error if nothing is sent to update
		if(firstName || lastName || password) {

			// get the token from the header
			var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

			// verify that the given token is valid for the phone number
			handlers._tokens.verifyToken(token,phone,function(tokenIsValid){
				if(tokenIsValid) {

					// lookup user
					_data.read('users',phone,function(err,userData){
						if(!err && userData) {

							//update the fields
							if(firstName) {
								userData.firstName = firstName;
							}
							if(lastName) {
								userData.lastName = lastName;
							}
							if(password) {
								userData.hashedPassword = helpers.hash(password);
							}

							// store the new updates
							_data.update('users',phone,userData,function(err){
								if(!err) {
									callback(200);
								} else {
									console.log(err);
									callback(500,{'Error' : 'Could not update the user'});
								}
							});
						} else {
							callback(400,{'Error' : 'The specified user does not exist'});
						}
					});		
				} else {
					callback(403,{'Error' : 'Missing required token in header, or invalid token'});
				}
			});
		} else {
			callback(400,{'Error' : 'Missing fields to update'});
		}
	} else {
		callback(400,{'Error' : 'Missing required field'});
	}
	
};

// users delete
// required field : phone
// @TODO only let authenticated user delete the object
// @TODO cleanup / delete any other data files associated with user
handlers._users.delete = function(data,callback) {

	// check if phone number exists
	var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
	if(phone) {

		// get the token from the header
		var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

		// verify that the given token is valid for the phone number
		handlers._tokens.verifyToken(token,phone,function(tokenIsValid){
			if(tokenIsValid) {

				// phone number exists, proceed and lookup the user
				_data.read('users',phone,function(err,userData){
					if(!err && userData) {
						_data.delete('users',phone,function(err){
							if(!err) {
								var userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];
								var checksToDelete = userChecks.length;
								if(checksToDelete > 0) {
									var checksDeleted = 0;
									var deletionErrors = false;

									// loop through checks
									userChecks.forEach(function(checkId) {
										// delete the check
										_data.delete('checks',checkId,function(err){
											if(err) {
												deletionErrors = true;
											}
											checksDeleted++;
											if(checksDeleted == checksToDelete) {
												if(!deletionErrors) {
													callback(200);
												} else {
													callback(500,{'Error' : 'Errors encountered while deleting checks, all checks not deleted successfully'});
												}
											}
										});
									});
								} else {
									callback(200);
								}
							} else {
								callback(500,{'Error' : 'Could not delete the user'});
							}
						});
					} else {
						callback(400,{'Error' : 'User not found'});
					}
				});
			} else {
				callback(403,{'Error' : 'Missing required token in header, or invalid token'});
			}
		});
	} else {
		// phone number invalid
		callback(400,{'Error' : 'Missing required fields'});
	}
};


// TOKENS

// create submethod selector based on http method
handlers.tokens = function(data,callback){
	var acceptableMethods = ['post','get','put','delete']
	if(acceptableMethods.indexOf(data.method) > -1) {
		handlers._tokens[data.method](data,callback);
	} else {
		callback(405);
	}
};

// tokens - post
handlers._tokens.post = function(data,callback) {
	var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
	var password = typeof(data.payload.password) == 'string' ? data.payload.password.trim() : false;
	if (phone && password) {

		// lookup user who matches phone
		_data.read('users',phone,function(err,userData){

			if(!err && userData) {

				// hash the sent password for comparison
				var hashedPassword = helpers.hash(password);
				if(hashedPassword == userData.hashedPassword) {

					// password valid, create new token with a random name with expiration date 1 hour in the future
					var tokenId = helpers.createRandomString(20);


					var expires = Date.now() + (1000 * 60 * 60);
					var tokenObject = {
						'phone' : phone,
						'id' : tokenId,
						'expires' : expires
					};

					// store the token
					_data.create('tokens',tokenId,tokenObject,function(err){
						if(!err) {
							callback(200,tokenObject);
						} else {
							callback(500,{'Error' : 'Could not create new token'});
						}
					});
				} else {

					callback(400,{'Error' : 'Invalid password'});
				}

			} else {

				callback(400, {'Error' : 'Could not find the specified user'});
			}
		});
	} else {
		callback(400, {'Error' : 'Missing required fields'});
	}
};

// // tokens - get
// Required : id
// Optional : none
handlers._tokens.get = function(data,callback) {
	
	// check if id is valid
	var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
	
	if(id) {

		// phone number exists, proceed and lookup the user
		_data.read('tokens',id,function(err,tokenData){
			if(!err && tokenData) {

				// success, callback with the tokenData
				callback(200,tokenData);
			} else {

				callback(404);
			}
		});
	} else {

		// phone number invalid
		callback(400,{'Error' : 'Missing required fields'});
	}
};

// // tokens - put
// required data : id, extend
handlers._tokens.put = function(data,callback) {

	// check if id is valid
	var id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;
	var extend = typeof(data.payload.extend) == 'boolean' && data.payload.extend == true ? true : false;

	if(id && extend) {

		// lookup the token
		_data.read('tokens',id,function(err,tokenData){

			if(!err && tokenData){

				// check if token has not already expired
				if(tokenData.expires > Date.now()) {

					// extend expiration
					tokenData.expires = Date.now() + (1000*3600);

					// update the token data
					_data.update('tokens',id,tokenData,function(err){
						if(!err) {
							callback(200);
						} else {
							callback(500,{'Error' : 'Could not update the token expiration'});
						}
					});

				} else {

					callback(400,{'Error' : 'Token has already expired'});
				}

			} else {
				
				callback(400,{'Error' : 'Specified token does not exist'});
			}
		});
	} else {
		callback(400,{'Error' : 'Missing required fields'});
	}

};

// // tokens - delete
handlers._tokens.delete = function(data,callback) {

	// check if phone number exists
	var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
	if(id) {

		// id passed, proceed and lookup the id
		_data.read('tokens',id,function(err,tokenData){
			if(!err && tokenData) {
				_data.delete('tokens',id,function(err){
					if(!err) {
						callback(200);
					} else {
						callback(500,{'Error' : 'Could not delete the token'});
					}
				});
				
			} else {
				callback(400,{'Error' : 'Token not found'});
			}
		});
	} else {

		// phone number invalid
		callback(400,{'Error' : 'Missing required fields'});
	}

};

// removes all the invalid tokens
handlers.tokensCleanup = function(data,callback) {

	// check if header contains MASTER token
	var masterToken = typeof(data.headers.token) == 'string' ? data.headers.token : false;
	

	if(masterToken && masterToken == config.masterToken) {
		// get a list of all tokens 
		_data.list('tokens',function(err,list) {
			var tokenList = list instanceof Array && list.length > 0 ? list : false;
		
			if(tokenList) {
				// loop through each token, append filenames of those which are invalid
				var deleteList = [];
				tokenList.forEach(function(token) {
					_data.read('tokens',token,function(err,readData) {
						if(!err && readData) {
							handlers._tokens.verifyToken(readData.id,readData.phone,function(answer){
								if(!answer) {
									deleteList.push(readData.id);
								}
								if(readData.id == tokenList[tokenList.length-1]) {
									// deleteList contains invalid tokens
									var deletionErrors = false;
									deleteList.forEach(function(invalidTokenId) {
										_data.delete('tokens',invalidTokenId,function(err) {
											if(err) {
												deletionErrors = true;
											}
											if(invalidTokenId == deleteList[deleteList.length-1]) {
												if(!deletionErrors) {
													callback(200);
												} else {
													callback(500,{'Error' : 'Some checks could not be deleted!'});
												}
											}
										});

									});
								}
							})
						} else {
							callback(500,{'Error' : 'Error reading one of the token files : ' + err});
						}
					});	
				});
			} else {
				callback(400,{'Error' : '0 total tokens found'});
			}
		});	

	} else {
		callback(401,{'Error' : 'Invalid master token passed!'});
	}
}

// CHECKS

// container for checks submethods
handlers._checks = {};

handlers.checks = function(data,callback){
	var acceptableMethods = ['post','get','put','delete']
	if(acceptableMethods.indexOf(data.method) > -1) {
		handlers._checks[data.method](data,callback);
	} else {
		callback(405);
	}
};

handlers._checks.post = function(data,callback) {
	var protocol = typeof(data.payload.protocol) == 'string' &&  ['https','http'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
	var url = typeof(data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
	var method = typeof(data.payload.method) == 'string' &&  ['post','get','delete','put'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
	var successCodes = typeof(data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
	var timeoutSeconds = typeof(data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 == 0 && data.payload.timeoutSeconds >=1 && data.payload.timeoutSeconds <=5 ? data.payload.timeoutSeconds : false;

	if (protocol && url && method && successCodes && timeoutSeconds) {

		// get token
		var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

		// lookup the user by reading the token
		_data.read('tokens',token,function(err,tokenData){
			if(!err && tokenData) {

				var userPhone = tokenData.phone;

				// lookup the user data
				_data.read('users',userPhone,function(err,userData){
					if(!err && userData) {
						var userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];

						// verify that the user has less than max-checks
						if(userChecks.length < config.maxChecks) {

							// create a random id for check
							var checkId = helpers.createRandomString(20);

							// create the check object and include the user's phone
							var checkObject = {
								'id' : checkId,
								'userPhone' : userPhone,
								'protocol' : protocol,
								'url' : url,
								'method' : method,
								'successCodes' : successCodes,
								'timeoutSeconds' : timeoutSeconds
							};

							// save the object
							_data.create('checks',checkId,checkObject,function(err){
								if(!err){

									// add checkId to the user's object
									userData.checks = userChecks;
									userData.checks.push(checkId);

									// save the new user data
									_data.update('users',userPhone,userData,function(err){
										if(!err) {
											
											// return the data about the new check
											callback(200,checkObject);
										} else {
											callback(500,{'Error' : 'Could not update the user with the new check'});
										}
									});

								} else {
									callback(500,{'Error' : 'Could not create the new check'});
								}
							});

						} else {
							callback(400,{'Error' : 'The user already has max number of checks ('+config.maxChecks+')'});
						}
					} else {
						callback(403,{'Error' : 'Not Authorized'});
					}
				});
			} else {
				callback(403,{'Error' : 'Not Authorized'});
			}
		});
	} else {
		callback(400,{'Error' : 'Missing required inputs'});
	}
};

/* 
INPUT : check ID in query string
OUTPUT : check data IFF token in header 
		belongs to the (user) owner of check
*/
handlers._checks.get = function(data,callback) {

	// validate id number given
	var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
	
	if(id) {

		// lookup the check
		_data.read('checks',id,function(err,checkData){
			if(!err && checkData) {

				// get the token from the header
				var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

				// verify that the given token is valid and belongs to the check owner
				handlers._tokens.verifyToken(token,checkData.userPhone,function(tokenIsValid){
					if(tokenIsValid) {

						// return the check data
						callback(200,checkData);
					} else {
						callback(403);
					}
				});
			} else {
				callback(404);
			}
		});
	} else {

		// id number invalid
		callback(400,{'Error' : 'Missing required fields'});
	}
};

// checks PUT
// required - id
// optional - protocol, url
handlers._checks.put = function(data,callback) {

	// get the id
	var id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;
	
	// optional fields
	var protocol = typeof(data.payload.protocol) == 'string' &&  ['https','http'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
	var url = typeof(data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
	var method = typeof(data.payload.method) == 'string' &&  ['post','get','delete','put'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
	var successCodes = typeof(data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
	var timeoutSeconds = typeof(data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 == 0 && data.payload.timeoutSeconds >=1 && data.payload.timeoutSeconds <=5 ? data.payload.timeoutSeconds : false;

	if(id) {

		if(protocol || url || method || successCodes || timeoutSeconds) {

			// Lookup the check
			_data.read('checks',id,function(err,checkData){
				if(!err && checkData) {
					// get the token from the header
					var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

					// verify that the given token is valid and belongs to the check owner
					handlers._tokens.verifyToken(token,checkData.userPhone,function(tokenIsValid){
						if(tokenIsValid) {

							// update where necessary
							if(protocol) {
								checkData.protocol = protocol;
							}
							if(url) {
								checkData.url = url;
							}
							if(method) {
								checkData.method = method;
							}
							if(successCodes) {
								checkData.successCodes = successCodes;
							}
							if(timeoutSeconds) {
								checkData.timeoutSeconds = timeoutSeconds;
							}

							// update the changes
							_data.update('checks',id,checkData,function(err){
								if(!err) {
									callback(200);
								} else {
									callback(500,{'Error' : 'Could not update the check'});
								}
							});

						} else {
							callback(403);
						}
					});

				} else {
					callback(400, {'Error' : 'Check ID did not exist'});
				}
			});

		} else {
			callback(400,{'Error' : 'Missing fields to update'});
		}

	} else {
		callback(400,{'Error' : 'Missing required fields'});
	}
}; 

handlers._checks.delete = function(data,callback) {

	// check if id number exists
	var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
	if(id) {

		// lookup the check
		_data.read('checks',id,function(err,checkData){

			if(!err && checkData) {
				
				// get the token from the header
				var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

				// verify that the given token is valid for the phone number
				handlers._tokens.verifyToken(token,checkData.userPhone,function(tokenIsValid){
					if(tokenIsValid) {

						_data.delete('checks',id,function(err){
							if(!err) {

								// phone number exists, proceed and lookup the user
								_data.read('users',checkData.userPhone,function(err,userData){
									if(!err && userData) {

										// get the user checks
										var userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];

										var checkPos = userChecks.indexOf(id);
										if(checkPos > -1) {
											userChecks.splice(checkPos,1);
											_data.update('users',checkData.userPhone,userData,function(err){
												if(!err) {
													callback(200);
												} else {
													callback(500,{'Error' : 'Could not delete the check from the user'});
												}
											});
										} else {
											callback(500,{'Error' : 'Could not find the check on the user\'s object'});
										}
									} else {
										callback(500,{'Error' : 'User not found'});
									}
								});
							} else {
								callback(500,{'Error' : 'Could not delete the check data'});
							}
						});

					} else {
						callback(403,{'Error' : 'Missing required token in header, or invalid token'});
					}
				});

			} else {
				callback(400,{'Error':'Specified ID does not exist'});
			}
		});
	} else {
		// id number invalid
		callback(400,{'Error' : 'Missing required fields'});
	}
};

// Favicon
handlers.favicon = function(data,callback) {
	// reject any request that isn't a GET
	if(data.method == 'get') {
		// read the favicon data
		helpers.getStaticAsset('favicon.ico',function(err,data){
			if(!err && data) {
				// callback the data
				callback(200,data,'favicon');
			} else {	
				callback(500);
			}
		});
	} else {
		callback(405);
	}
};

handlers.public = function(data,callback) {
	// reject any request that isnt a GET
	if(data.method == 'get') {
		// get the filename being requested
		var trimmedAssetName = data.trimmedPath.replace('public/','').trim();
		if(trimmedAssetName.length > 0) {
			// read the asset's data
			helpers.getStaticAsset(trimmedAssetName,function(err,data){
				if(!err && data) {
					// determine the content type 
					var contentType = 'plain';

					if(trimmedAssetName.indexOf('.css') > -1) {
						contentType = 'css';
					}

					if(trimmedAssetName.indexOf('.png') > -1) {
						contentType = 'png';
					}

					if(trimmedAssetName.indexOf('.jpg') > -1) {
						contentType = 'jpg';
					}

					if(trimmedAssetName.indexOf('.ico') > -1) {
						contentType = 'favicon';
					}

					callback(200,data,contentType);
				} else {
					callback(404);
				}
			});
		} else {

		}
	} else {
		callback(405);
	}
};


// export the handlers
module.exports = handlers;