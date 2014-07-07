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
		,externs: []
		,targets: []
	};
	
	//init externs
	self.externs = ['2-closure/externs/jquery-1.7.externs.js'];
		
	//init target paths
	self.targets = [
		'../content/js/jplist-admin.min.js'
	];	
	
	//load package.json
	self.packageJson = JSON.parse(self.fs.readFileSync('package.json', 'utf8')); 
		
	//init files list
	self.coreFiles = self.packageJson['js-sources'];
	
	//compile with google closure compiler
	compiler.compile(self.targets, self.coreFiles, self.externs);
	
})();

