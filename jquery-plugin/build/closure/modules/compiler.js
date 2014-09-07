/** IN THIS VERSION FIXED BUG WITH SECURITY PERMISSIONS */

/**
* globals
*/
var fs = require('fs')
	,PACKAGE_JSON_PATH = './package.json';
	
/**
* get version from package.json, increment it and return new version
* @return {string}
*/
var getVersion = function(packageJsonPath){

	var version = null
		,versionSections = []
		,packageJson
		,last
		,json;
	
	//read package.json
	packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')); 

	//get version from package.json
	version = packageJson['version'];
	
	if(version){
	
		//get version sections
		versionSections = version.split('.');
		
		if(versionSections.length === 3){
			
			//get last section
			last = Number(versionSections[2]);
			
			if(!isNaN(last)){
			
				//increment
				last++;
				
				//create new version
				version = versionSections[0] + '.' + versionSections[1] + '.' + last;
				
				//update version
				packageJson['version'] = version;
				
				//get json as string
				json = JSON.stringify(packageJson, null, '\t');
				
				//save package.json
				fs['writeFileSync'](packageJsonPath, json, 'utf8');
			}
		}
	}
	
	return version;
};

/**
* update version in the given file
* @param {string} newVersion
* @param {string} fileContent
* @param {string} replaceMacro
* @return {string} file content with replaced version
*/
var getUpdatedVersion = function(newVersion, fileContent, replaceMacro){
	
	var regex = new RegExp(replaceMacro, 'g');
	
	//update version
	return fileContent.replace(regex, newVersion);
};

/**
* compile with google closure compiler
* @param {Array.<string>} targets
* @param {Array.<string>} files
* @param {string} externs 
*/
var compile = function(targets, files, externs, ifSetVersion){

	var ClosureCompiler = require('closurecompiler')
		,version
		,target;
	
	//compile with google closure compiler
	ClosureCompiler.compile(
		files
		,{
			// Options in the API exclude the "--" prefix
			compilation_level: "SIMPLE_OPTIMIZATIONS" //WHITESPACE_ONLY, SIMPLE_OPTIMIZATIONS, ADVANCED_OPTIMIZATIONS
			
			//,create_source_map: '../minified/jplist.min.map'
			//,source_map_format: 'V3'
			
			,warning_level: "VERBOSE" //QUIET | DEFAULT |  VERBOSE

			// Capitalization does not matter 
			//,Formatting: "PRETTY_PRINT"

			// If you specify a directory here, all files inside are used
			,externs: externs
			
			,process_jquery_primitives: true

			// ^ As you've seen, multiple options with the same name are
			//   specified using an array.
			//...
		}
		,function(error, result) {
			
			//display error/warnings
			console.log(error);
			
			if (result) {
				//write result to file			
				//console.log(result);
				
				if(ifSetVersion){
				
					//get version from package.json, increment it and return new version
					version = getVersion(PACKAGE_JSON_PATH);
					
					if(version != null){
							
						//update version in the target file
						result = getUpdatedVersion(version, result, '##VERSION##');						
					}
				}
				
				for(var i=0; i<targets.length; i++){
					
					//get target
					target = targets[i];					
					
					//write file		
					fs['writeFileSync'](target, result, 'utf8');					
				}
				
				//Press any key to exit
				console.log('Press any key to exit');
				process.stdin.setRawMode(true);
				process.stdin.resume();
				process.stdin.on('data', process.exit.bind(process, 0));
			} 
		}
	);
};

/**
* EXPORTS: compile with google closure compiler
* @param {Array.<string>} targets
* @param {Array.<string>} files
* @param {string} externs 
*/
exports.compile = function(targets, files, externs){
	compile(targets, files, externs);
};
