/**
* create scripts list
* @param {string} msg
* @param {Array.<string>} files
* @param {boolean} encoded - if true => replace < to &lt; 
*/
var createScriptsList = function(msg, files, encoded){
	
	var file;
	
	console.log();
	console.log(msg);
	
	for(var i=0; i<files.length; i++){
	
		//get file
		file = files[i];
		
		if(encoded){
			console.log('&lt;script src="' + file + '">&lt;/script>');
		}
		else{
			console.log('<script src="' + file + '"></script>');
		}
	}
};


/**
* emtry point
*/
var init = (function(){
	
	var self = {
	
		//libs
		fs: require('fs')			
		,packageJson: null
		,mainFiles: []
		,controlsFiles: []
	};
	
	//load package.json
	self.packageJson = JSON.parse(self.fs.readFileSync('package.json', 'utf8')); 
		
	//init files list
	self.mainFiles = self.packageJson['jplist-source-files-core'];
	self.controlsFiles = self.packageJson['jplist-source-files-controls'];
	
	//create scripts list
	createScriptsList('//main source files', self.mainFiles, false);
	createScriptsList('//controls source files', self.controlsFiles, false);	
	
	console.log();
	console.log('-----------------------------------------------------------');
	console.log();
	
	//create scripts list
	createScriptsList('//main source files', self.mainFiles, true);
	createScriptsList('//controls source files', self.controlsFiles, true);	
})();

