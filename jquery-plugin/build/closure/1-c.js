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
        ,controlsFiles: []
		,externs: []
		,targets: []
	};
	
	//init externs
	context.externs = ['closure/externs/jquery-1.7.externs.js'];
		
	//init target paths
	context.targets = [
		'../minified/jplist.min.js'
		,'../html/js/jplist.min.js'
	];	
	
	//load package.json
	context.packageJson = JSON.parse(context.fs.readFileSync('package.json', 'utf8')); 
		
	//init files list
	context.coreFiles = context.packageJson['jplist-source-files-core'];
    context.controlsFiles = context.packageJson['jplist-source-files-controls'];
	
	//compile with google closure compiler
	compiler.compile(context.targets, context.coreFiles.concat(context.controlsFiles), context.externs);
	
})();

