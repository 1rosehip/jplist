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
            compilation_level: "SIMPLE_OPTIMIZATIONS" //WHITESPACE_ONLY, SIMPLE_OPTIMIZATIONS, ADVANCED_OPTIMIZATIONS

            ,warning_level: "VERBOSE" //QUIET | DEFAULT |  VERBOSE

            // Capitalization does not matter 
            //,Formatting: "PRETTY_PRINT"

            // If you specify a directory here, all files inside are used
            ,externs: config.externs

            ,process_jquery_primitives: true

            // ^ As you've seen, multiple options with the same name are
            //   specified using an array.
            //...
        }
        ,function(error, result) {
            
            if(error){
                console.log(error);
            }
            
            console.log('=========================================');
            
            if(result){
                console.log("Creating output file: " + config.dist);
                fs.writeFileSync(config.dist, result, 'utf8');	
            }
        }

    );
}