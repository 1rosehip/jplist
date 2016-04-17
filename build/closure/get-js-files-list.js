var fs = require('fs');

if(!process.argv || process.argv.length < 3){
    console.log('ERROR: config.js file is not specified.');
    return;
}

var configPath = process.argv[2];

var type = "script";

if(process.argv[3]){
    type = process.argv[3].replace('--type=', '');
}

//load config.js file
var config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

config.src.forEach(function(src){
   
    switch(type){

        case 'script':{

            console.log('<script src="' + src + '"></script>');
            break;
        }

        case 'files':{
            console.log(src);
            break;
        }

        case 'github':{

            console.log('<script src="https://raw.githubusercontent.com/no81no/jplist/master/' + src + '"></script>');
            break;
        }
    } 
});
