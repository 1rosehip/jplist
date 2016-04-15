var fs = require('fs');
var path = require('path');
var compile = require('./compile.js');

//get all folders in ./src
fs.readdirSync('./src').forEach(function(dir){
    
    var stat = fs.statSync('src/' + dir);
    
    if(stat.isDirectory()){
        
        //load js/config.js
        var configPath = 'src/' + dir + '/js/config.json';
        
        if(fs.existsSync(configPath)){
            
            //start compilation
            compile(configPath);
        }
    }
   
});