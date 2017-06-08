const request = require('request');
const fs 	  = require('fs');

module.exports = {
	test: function(){
		
	},
  init: function (file_path, file_name, file_format) {
  	fs.readFile(file_path, (err, data) => {
		if (err) {
		  return console.error(err);
		}

	  	var file = {
	  		id: this.generate_id(),
	  		name: file_name,
	  		path: file_path,
	  		format: file_format,
	  		version: 0
	  	}

		this.buffer = data
		this.upload(file, true)
	});
  },
  generate_id: function(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  },
  upload: function(file, first = false){

  	var options = {
  		method: "POST",
  		url: 'https://content.dropboxapi.com/2/files/upload',
  		headers: {
  			'Authorization': 'hehe',
  			'Dropbox-API-Arg': "{\"path\": \"/"+file.id+"/"+file.name+file.version+file.format+"\",\"mode\": \"add\",\"autorename\": true,\"mute\": true}",
  			'Content-Type': 'application/octet-stream',
  		},
  		body: this.buffer,
  	}

  	request(options, (error, response, body) => {
	  console.log('error:', error); // Print the error if one occurred
	  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
	  console.log('body:', body); // Print the HTML for the Google homepage.

	  if(response.statusCode == 200 && first == true){
	  	setInterval(() => {
			console.log("checking diff")
			this.diff(file)
		}, 5000)
	  }
	  	
	});
  },
  diff: function(file){
  	fs.readFile(file.path, (err, data) => {
		if (err) {
		  return console.error(err)
		}
		if (this.buffer.toString('utf8') != data.toString('utf8')){
			file.version = file.version + 1
			console.log("file changed to version "+file.version)
			this.buffer = data
			this.upload(file)
		} else {
			console.log("no changes")
		}
	});
  }
};