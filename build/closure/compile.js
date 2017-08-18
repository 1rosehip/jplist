var fs = require('fs');
var closureCompiler = require('closurecompiler');

/**
 * get license file
 * @param {string} configPath
 */
var getLicenseFile = function(configPath){

    var licenseFile = '';

    try {
        licenseFile = fs.readFileSync(configPath.replace('config.json', 'license.js'), 'utf8');
    }
    catch (e) {}

    if(!licenseFile){

        //get general license file
        licenseFile = fs.readFileSync('src/licenses/license.js', 'utf8');
    }

    return licenseFile;
};

/**
 * compiler
 * @param {string} configPath - the path to ./src/js-core-or-control/js/config.js file
 * @param {string} additionalArgs
 */
var compiler = function(configPath, additionalArgs){

    //load config.js file
    var config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    var warningLevel = 'DEFAULT'; //QUIET | DEFAULT |  VERBOSE

    if(config){

        if(additionalArgs && additionalArgs.indexOf('--verb') !== -1){
            warningLevel = 'VERBOSE';
        }

        //start compilation
        closureCompiler.compile(

            //files list to compile
            config.src
            ,{
                // Options in the API exclude the "--" prefix
                compilation_level: 'SIMPLE_OPTIMIZATIONS' //WHITESPACE_ONLY, SIMPLE_OPTIMIZATIONS, ADVANCED_OPTIMIZATIONS

                ,warning_level: warningLevel

                // Capitalization does not matter 
                //,Formatting: "PRETTY_PRINT"

                // If you specify a directory here, all files inside are used
                ,externs: config.externs

                //,process_jquery_primitives: true
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
                    var license = getLicenseFile(configPath);

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
};

/**
* entry point
*/
module.exports = function(configPath, additionalArgs) {
    compiler(configPath, additionalArgs);
};