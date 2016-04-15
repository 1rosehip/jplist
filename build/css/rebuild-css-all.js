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
            
            /*
            var command = 'lessc -x src/' + dir + '/css/styles.less > dist/css/jplist.' + dir + '.min.css';
            
            exec(command, function(err, data) {  
                console.log(err)
                console.log(data.toString());                       
            });  
            */
            var styles = fs.readFileSync(stylesPath, 'utf8');
            
            less.render(
                
                styles
                ,{
                    //specify search paths for @import directives
                    paths: ['themes']
                    
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