module.exports = {
    
    "Gruntfile.min.js": function(test) {
        var fs = require("fs");
        test.doesNotThrow(function() {
            var source = fs.readFileSync(__dirname+"/../Gruntfile.min.js");
        });
        test.done();
    }
    
};