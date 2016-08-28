var compile = require('./compile.js');

if(!process.argv || process.argv.length < 3){
    console.log('ERROR: addon alias is not specified.');
    return;
}

//src/addons/textbox-filter/js/config.json
var addonAlias = 'src/addons/' + process.argv[2] + '/js/config.json';

if(addonAlias){

    compile(addonAlias, process.argv[3]);
}

