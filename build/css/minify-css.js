/**
 * jPList addons css minification helper
 *
 * Usage:
 * npm run cssaddon -- addon-alias-name
 *
 * Example:
 * npm run cssaddon -- store-locator-bundle
 */

if(process.argv.length > 2){

    var alias = process.argv[2];

    if(alias) {

        //lessc -x src/addons/store-locator-bundle/css/styles.less > dist/css/jplist.store-locator-bundle.min.css
        console.log('jPList addon CSS minification: ' + alias);

        var exec = require('child_process').exec;

        exec('lessc --clean-css --autoprefix src/addons/' + alias + '/css/styles.less > dist/css/jplist.' + alias + '.min.css', function(error, stdout, stderr) {

            console.log(stdout);
            console.log(stderr);

            if (error) {
                console.log('exec error: ' + error);
            }
        });


    }
}
else{
    console.log('ERROR: addon alias is not specified.');
}