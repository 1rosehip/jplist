var compiler = require('./modules/compiler.js');

/**
* entry point
*/
var init = (function(){
	
	var context = {
	
		//libs
		fs: require('fs')
		,path: require('path')				
		,packageJson: null
		,coreFiles: []
		,externs: []
		,targets: []
	};
	
	//init externs
	context.externs = [
		'closure/externs/jquery-1.7.externs.js'
		,'closure/externs/jplist-core.externs.js'
	];
		
	//init target paths
	context.targets = [
		'../minified/sections/core.min.js'
	];	
	
	//load package.json
	context.packageJson = JSON.parse(context.fs.readFileSync('package.json', 'utf8')); 
		
	//init files list
	context.coreFiles = context.packageJson['jplist-source-files-core'];
	
	//compile with google closure compiler
	compiler.compile(context.targets, context.coreFiles, context.externs, true);
	
})();

