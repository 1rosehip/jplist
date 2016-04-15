var fs = require('fs');
var path = require('path');
var less = require('less');

//get all folders in ./src
fs.readdirSync('./src').forEach(function(dir){
    
    var stat = fs.statSync('src/' + dir);
    
    if(stat.isDirectory()){
        
        //load js/config.js
        var stylesPath = 'src/' + dir + '/css/styles.less';
        
        if(fs.existsSync(stylesPath)){
           
            var styles = fs.readFileSync(stylesPath, 'utf8');
            
            less.render(
                
                styles
                ,{
                    //specify search paths for @import directives
                    paths: []
                    
                    //minify css
                    ,compress: true
                    
                    //specify a filename, for better error messages
                    //,filename: 'style.less'
                }      
                , function (e, output) {
                    console.log(arguments);
                }
            );
            
        }
    }
   
});