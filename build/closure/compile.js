var fs = require('fs');
var closureCompiler = require('closurecompiler');

if(!process.argv || process.argv.length < 3){
    console.log('ERROR: config.js file is not specified.');
    return;
}

//load config.js file
var configPath = process.argv[2];
var config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

if(config){

    //start compilation
    closureCompiler.compile(

        //files list to compile
        config.src
        ,{
            // Options in the API exclude the "--" prefix
            compilation_level: 'SIMPLE_OPTIMIZATIONS' //WHITESPACE_ONLY, SIMPLE_OPTIMIZATIONS, ADVANCED_OPTIMIZATIONS

            ,warning_level: 'VERBOSE' //QUIET | DEFAULT |  VERBOSE

            // Capitalization does not matter 
            //,Formatting: "PRETTY_PRINT"

            // If you specify a directory here, all files inside are used
            ,externs: config.externs

            ,process_jquery_primitives: true
        }
        ,function(error, result) {
            
            if(error){
                console.log(error);
            }
            
            console.log('=============================================================================');
            
            if(result){
                
                //get basic version from package.json
                var packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8')); 
                
                //get additional version
                var additionalVersion = Number(config.version);
                
                if(isNaN(additionalVersion)){
                    additionalVersion = 0;
                }
                else{
                    additionalVersion++;
                }
               
                //combine versions
                var version = packageJson.version + '.' + additionalVersion;
                
                //read licens.js file
                var license = fs.readFileSync('src/licenses/license.js', 'utf8');
                var year = (new Date()).getFullYear();
                var updateLicense = license.replace('##year##', year).replace('##version##', version);
                
                //create output js file
                console.log('Creating output file: ' + config.dist);
                fs.writeFileSync(config.dist, updateLicense + result, 'utf8');	
                
                //update version in the config file
                config.version = additionalVersion;
				var configJson = JSON.stringify(config, null, '\t');
                fs.writeFileSync(configPath, configJson, 'utf8');	
            }
        }

    );
}