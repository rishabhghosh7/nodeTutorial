// front end logic for the application

var app = {};

// config
app.config = {
	'sessionToken' : false
};

// ajax client (for api)
app.client = {};

// interface for making API calls
// input - header object / API path / METHOD / query parameters / callback
// @TODO 
//	-> what is XML http?
// 	->
app.client.request = function(headers,path,method,queryStringObject,payload,callback) {

	// set defaults ugh
	headers = typeof(headers) == 'object' && headers !== null ? headers : {};
	path = typeof(path) == 'string' ? path : '/';
	method = typeof(method) == 'string' && ['POST','GET','PUT','DELETE'].indexOf(method) > -1 ? method.toUpperCase() : 'GET';
	queryStringObject = typeof(queryStringObject) == 'object' && queryStringObject !== null ? queryStringObject : {};
	payload = typeof(payload) == 'object' && payload !== null ? payload : {};
	callback = typeof(callback) == 'function' ? callback : false;

	// construct request url from query string object
	var requestUrl = path+'?';
	var counter = 0;
	for(var queryKey in queryStringObject) {
		if(queryStringObject.hasOwnProperty(queryKey)) {
			counter++;
			if(counter > 1) {
				requestUrl += '&';
			}

			// add the key and value
			requestUrl += queryKey + '=' + queryStringObject[queryKey];
		}
	}

	// form the http request as JSON type
	var xhr = new XMLHttpRequest();
	xhr.open(method,requestUrl,true);
	xhr.setRequestHeader("Content-Type","application/json");

	// for each header sent, add it to the request
	for(var headerKey in headers) {
		if(headers.hasOwnProperty(headerKey)) {
			xhr.setRequestHeader(headerKey,headers[headerKey]);
		}
	}

	// include session token if any
	if(app.config.sessionToken) {
		xhr.setRequestHeader("token",app.config.sessionToken.id);
	}

	// when the request comes back, handle the request
	xhr.onreadystatechange = function() {
		if(xhr.readyState == XMLHttpRequest.DONE) {
			var statusCode = xhr.status;
			var responseReturned = xhr.responseText;

			// callback if requested
			if(callback) {
				try {
					var parsedResponse = JSON.parse(responseReturned);
					callback(statusCode,parsedResponse);
				} catch (e) {
					callback(statusCode,false);
				}
			}
		}
	};
	
	// send the payload as JSON
  
	var payloadString = JSON.stringify(payload);
	xhr.send(payloadString); 
};

// Bind the logout button
app.bindLogoutButton = function(){
  document.getElementById("logoutButton").addEventListener("click", function(e){

    // Stop it from redirecting anywhere
    e.preventDefault();

    // Log the user out
    app.logUserOut();

  });
};


// log the user out and then redirect them
app.logUserOut = function(redirectUser) {
	// get the current token id
	var tokenId = typeof(app.config.sessionToken.id) == 'string' ? app.config.sessionToken.id : '';
  redirectUser = typeof(redirectUser) == 'boolean' ? redirectUser : true;

		// invalidate the token by deleting it by calling the API
		var queryStringObject = {
			'id' : tokenId
		};

		app.client.request(undefined,'api/tokens','DELETE',queryStringObject,undefined,function(statusCode,responsePayload){
			// set the app.config token as false
			app.setSessionToken(false);

			// send the user to the logged out page
      if(redirectUser) {
  			window.location = '/session/deleted';
      }
		});
};

// Bind the forms
app.bindForms = function(){
  if(document.querySelector("form")){

    var allForms = document.querySelectorAll("form");
    for(var i = 0; i < allForms.length; i++){
        allForms[i].addEventListener("submit", function(e){

        // Stop it from submitting
        e.preventDefault();
        var formId = this.id;
        var path = this.action;
        console.log(this.method);
        var method = this.method.toUpperCase();

        // Hide the error message (if it's currently shown due to a previous error)
        document.querySelector("#"+formId+" .formError").style.display = 'none';

        // Hide the success message (if it's currently shown due to a previous error)
        if(document.querySelector("#"+formId+" .formSuccess")){
          document.querySelector("#"+formId+" .formSuccess").style.display = 'none';
        }


        // Turn the inputs into a payload
        var payload = {};
        var elements = this.elements;
        for(var i = 0; i < elements.length; i++){
          if(elements[i].type !== 'submit'){
            // Determine class of element and set value accordingly
            var classOfElement = typeof(elements[i].classList.value) == 'string' && elements[i].classList.value.length > 0 ? elements[i].classList.value : '';
            var valueOfElement = elements[i].type == 'checkbox' && classOfElement.indexOf('multiselect') == -1 ? elements[i].checked : ( classOfElement.indexOf('intval') == -1 ? elements[i].value : parseInt(elements[i].value));
            var elementIsChecked = elements[i].checked;

            // Override the method of the form if the input's name is _method
            var nameOfElement = elements[i].name;
            if(nameOfElement == '_method'){
              method = valueOfElement;
            } else {
              // Create an payload field named "method" if the elements name is actually httpmethod
              if(nameOfElement == 'httpmethod'){
                nameOfElement = 'method';
              }
              // If the element has the class "multiselect" add its value(s) as array elements
              if(classOfElement.indexOf('multiselect') > -1){
                if(elementIsChecked){
                  payload[nameOfElement] = typeof(payload[nameOfElement]) == 'object' && payload[nameOfElement] instanceof Array ? payload[nameOfElement] : [];
                  payload[nameOfElement].push(valueOfElement);
                }
              } else {
                payload[nameOfElement] = valueOfElement;
              }

            }
          }
        }
        console.log(payload);

        // If the method is DELETE, the payload should be a queryStringObject instead
        var queryStringObject = method == 'DELETE' ? payload : {};

        // Call the API
        app.client.request(undefined,path,method,queryStringObject,payload,function(statusCode,responsePayload){
          // Display an error on the form if needed
          if(statusCode !== 200){

            if(statusCode == 403){
              // log the user out
              app.logUserOut();

            } else {

              // Try to get the error from the api, or set a default error message
              var error = typeof(responsePayload.Error) == 'string' ? responsePayload.Error : 'An error has occured, please try again';

              // Set the formError field with the error text
              document.querySelector("#"+formId+" .formError").innerHTML = error;

              // Show (unhide) the form error field on the form
              document.querySelector("#"+formId+" .formError").style.display = 'block';
            }
          } else {
            // If successful, send to form response processor
            app.formResponseProcessor(formId,payload,responsePayload);
          }

        });
      });
    }
  }
};

// Form response processor
app.formResponseProcessor = function(formId,requestPayload,responsePayload){
  var functionToCall = false;

  /* 
    SIGNUP
    1. Make a payload with phone,password
    2. Get valid token using payload and set token
  */
  if(formId == 'accountCreate'){
    // Take the phone and password, and use it to log the user in
    var newPayload = {
      'phone' : requestPayload.phone,
      'password' : requestPayload.password
    };

    app.client.request(undefined,'api/tokens','POST',undefined,newPayload,function(newStatusCode,newResponsePayload){
      // Display an error on the form if needed
      if(newStatusCode !== 200){

        // Set the formError field with the error text
        document.querySelector("#"+formId+" .formError").innerHTML = 'Sorry, an error has occured. Please try again.';

        // Show (unhide) the form error field on the form
        document.querySelector("#"+formId+" .formError").style.display = 'block';

      } else {
        // If successful, set the token and redirect the user
        app.setSessionToken(newResponsePayload);
        window.location = '/';
      }
    });
  }
  /*
    LOGIN
    1. Original form returns token
    2. Set token in local storage 
  */
  if(formId == 'sessionCreate') {
    app.setSessionToken(responsePayload);
    window.location = '/';
  }

  // If forms saved successfully and they have success messages, show them
  var formsWithSuccessMessages = ['accountEdit1', 'accountEdit2'];
  if(formsWithSuccessMessages.indexOf(formId) > -1){
    document.querySelector("#"+formId+" .formSuccess").style.display = 'block';
  }

  if(formId == 'accountEdit3') {
    app.logUserOut(false);
    window.location = '/account/deleted';
  }

  if(formId == 'checksCreate') {
    window.location('checks/all');
  }
};

// Get the session token from localstorage and set it in the app.config object
app.getSessionToken = function(){
  var tokenString = localStorage.getItem('token');
  if(typeof(tokenString) == 'string'){
    try{
      var token = JSON.parse(tokenString);
      app.config.sessionToken = token;
      if(typeof(token) == 'object'){
        app.setLoggedInClass(true);
      } else {
        app.setLoggedInClass(false);
      }
    }catch(e){
      app.config.sessionToken = false;
      app.setLoggedInClass(false);
    }
  }
};

// Set (or remove) the loggedIn class from the body
app.setLoggedInClass = function(add){
  var target = document.querySelector("body");
  if(add){
    target.classList.add('loggedIn');
  } else {
    target.classList.remove('loggedIn');
  }
};

// Set the session token in the app.config object as well as localstorage
// PARAM : token is an object returned by a GET call to api/tokens
app.setSessionToken = function(token){
  app.config.sessionToken = token;
  var tokenString = JSON.stringify(token);
  localStorage.setItem('token',tokenString);
  if(typeof(token) == 'object'){
    app.setLoggedInClass(true);
  } else {
    app.setLoggedInClass(false);
  }
};

// Renew the token
app.renewToken = function(callback){
  var currentToken = typeof(app.config.sessionToken) == 'object' ? app.config.sessionToken : false;
  if(currentToken){
    // Update the token with a new expiration
    var payload = {
      'id' : currentToken.id,
      'extend' : true,
    };
    app.client.request(undefined,'api/tokens','PUT',undefined,payload,function(statusCode,responsePayload){
      // Display an error on the form if needed
      if(statusCode == 200){
        // Get the new token details
        var queryStringObject = {'id' : currentToken.id};
        app.client.request(undefined,'api/tokens','GET',queryStringObject,undefined,function(statusCode,responsePayload){
          // Display an error on the form if needed
          if(statusCode == 200){
            app.setSessionToken(responsePayload);
            callback(false);
          } else {
            app.setSessionToken(false);
            callback(true);
          }
        });
      } else {
        app.setSessionToken(false);
        callback(true);
      }
    });
  } else {
    app.setSessionToken(false);
    callback(true);
  }
};

// Load data on the page
app.loadDataOnPage = function(){
  // Get the current page from the body class
  var bodyClasses = document.querySelector("body").classList;
  var primaryClass = typeof(bodyClasses[0]) == 'string' ? bodyClasses[0] : false;

  // Logic for account settings page
  if(primaryClass == 'accountEdit'){
    console.log('loadAccountEditPage called!');
    app.loadAccountEditPage();
  }
};

// Load the account edit page specifically
app.loadAccountEditPage = function(){

  // Get the phone number from the current token, or log the user out if none is there
  var phone = typeof(app.config.sessionToken.phone) == 'string' ? app.config.sessionToken.phone : false;
  if(phone){

    // Fetch the user data
    var queryStringObject = {
      'phone' : phone
    };
    // send a GET request to the API to get data which will be used to fill the edit page
    app.client.request(undefined,'api/users','GET',queryStringObject,undefined,function(statusCode,responsePayload){
      if(statusCode == 200){
        // Put the data into the forms as values where needed
        document.querySelector("#accountEdit1 .firstNameInput").value = responsePayload.firstName;
        document.querySelector("#accountEdit1 .lastNameInput").value = responsePayload.lastName;
        document.querySelector("#accountEdit1 .displayPhoneInput").value = responsePayload.phone;

        // Put the hidden phone field into both forms
        var hiddenPhoneInputs = document.querySelectorAll("input.hiddenPhoneNumberInput");
        for(var i = 0; i < hiddenPhoneInputs.length; i++){
            hiddenPhoneInputs[i].value = responsePayload.phone;
        }

      } else {
        // If the request comes back as something other than 200, log the user our (on the assumption that the api is temporarily down or the users token is bad)
        app.logUserOut();
      }
    });
  } else {
    // phone number not found in token so logging user out
    app.logUserOut();
  }
}

// Loop to renew token often
app.tokenRenewalLoop = function(){
  setInterval(function(){
    app.renewToken(function(err){
      if(!err){
        console.log("Token renewed successfully @ "+Date.now());
      }
    });
  },1000 * 60);
};

// Init (bootstrapping)
app.init = function(){

  /* 
    1. Bind to all forms on page
    2. Creates request payload and makes API call
    3. Sends request payload and response payload to form processor function
  */
  app.bindForms();

  /* 
    1. Listens for logout button
    2. On logout, triggers logout function
    3. logout function - DELETE call to API and invalidates token
    4. redirects to logout page
  */
  app.bindLogoutButton();

  // Get the token from localstorage
  app.getSessionToken();

  // Renew token
  app.tokenRenewalLoop();

  // Load data on page
  app.loadDataOnPage();

};

// Call the init processes after the window loads
$(document).ready(function(){
  app.init();
})