var compiler = require('./modules/compiler.js');

/**
* entry point
*/
var init = (function(){
	
	var self = {
	
		//libs
		fs: require('fs')
		,path: require('path')				
		,packageJson: null
		,coreFiles: []
        ,controlsFiles: []
		,externs: []
		,targets: []
	};
	
	//init externs
	self.externs = ['closure/externs/jquery-1.7.externs.js'];
		
	//init target paths
	self.targets = [
		'../minified/jplist.min.js'
		,'../html/js/jplist.min.js'
	];	
	
	//load package.json
	self.packageJson = JSON.parse(self.fs.readFileSync('package.json', 'utf8')); 
		
	//init files list
	self.coreFiles = self.packageJson['jplist-source-files-core'];
    self.controlsFiles = self.packageJson['jplist-source-files-controls'];
	
	//compile with google closure compiler
	compiler.compile(self.targets, self.coreFiles.concat(self.controlsFiles), self.externs);
	
})();

