// dependencies
var fs = require('fs');
var path = require('path');
var helpers = require('./helpers');

// container for module to be exported
var lib = {};

// base directory 
lib.baseDir = path.join(__dirname,'/../.data/');

// create writes data to a file
// dir : Folder to be written in
// file : name of file to be written in
// data : Object to be stored in file
// callback : function(error) used to send back errors, if any
lib.create = function(dir,file,data,callback){

	// open the file for writing
	fs.open(lib.baseDir+dir+'/'+file+'.json','wx',function(err,fileDescriptor){
		
		// check for errors opening the file, if file descriptor exists
		if(!err && fileDescriptor){

			// convert data to string
			var stringData = JSON.stringify(data);

			 // write to file and close it
			 fs.writeFile(fileDescriptor,stringData,function(err){
			 	
			 	// check for error writing to file
			 	if(!err){
			 		fs.close(fileDescriptor,function(err){

			 			// check for error closing file
			 			if(!err){	
			 				callback(false);
			 			} else {
			 				callback('Error closing file');
			 			} 
			 		});
			 	} else {
			 		callback('Error writing to new file');
			 	}
			 });
		} else {
			callback('Could not create new file, it may already exist!');
		}
	});
};

// read data from a file
lib.read = function(dir,file,callback){
	fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf8',function(err,data){

		// if no error reading file and data exists
		if(!err && data) {
			var parsedData = helpers.parseJsonToObject(data);
			callback(false,parsedData);
		} else {
			callback(err,data);
		}
	});
};

// update data inside a file
lib.update = function(dir,file,data,callback){
	
	//open the file for writing
	fs.open(lib.baseDir+dir+'/'+file+'.json','r+',function(err,fileDescriptor){
		if(!err) {

			// convert data to string
			var stringData = JSON.stringify(data);

			// truncate the file
			fs.ftruncate(fileDescriptor,function(err){
				if(!err) {
					
					// write to the file and close it
					fs.writeFile(fileDescriptor,stringData,function(err){
						if(!err) {
							fs.close(fileDescriptor,function(err){
								if(!err) {
									callback(false);
								} else {
									callback('Error closing the file');
								}
							});

						} else {
							callback('Error writing to existing file');
						}
					});

				} else {
					callback('Error truncating file');
				}
			});
		} else {
			callback('could not open the file for updating, it may not exist yet');
		}
	});
};

// delete data
lib.delete = function(dir,file,callback) {
	// unlink the file
	fs.unlink(lib.baseDir+dir+'/'+file+'.json',function(err){
		if(!err) {
			callback(false);
		} else {
			callback('Error deleting file');
		}
	});
};

// list all the items in a directory
lib.list = function(dir,callback){
	fs.readdir(lib.baseDir+dir+'/',function(err,data){
		if(!err && data && data.length > 0) {
			var trimmedFileNames = [];
			data.forEach(function(fileName){
				trimmedFileNames.push(fileName.replace('.json',''));
			});
			callback(false,trimmedFileNames);
		} else {
			callback(err,data);
		}
	});
};

// export the module
module.exports = lib;