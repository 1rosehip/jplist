var util = require('util'),
    events = require('events');

var colors = require('colors');

var testsResults = {
    passed:0,
    failed:0
}

var CustomReporter = function(options) {

    /**
     * on all tests start
     */
    this.on('start', function() {

        console.log('___ ___  __ ___ '.blue.bold);
        console.log(' )  )_  (_   )  '.blue.bold);
        console.log('(  (__  __) (   '.blue.bold);
    });

    /**
     * on all tests end
     */
    this.on('end', function(param1,param2) {

        console.log('');
        console.log('--------------------------------------------'.blue.bold);

        if(!testsResults.failed) {
            console.log('All tests passed'.green);
        }
        //else {
            //console.log((testsResults.failed + ' test(s) failed.').red);
        //}

        console.log((testsResults.failed + testsResults.passed +  ' total test(s)').blue.bold);
        console.log((testsResults.passed + ' passed').green);
        console.log((testsResults.failed +' failed').red);
        console.log('');
    });

    /**
     * on suite start
     */
    this.on('suite:start', function(param1) {

        //print the suite title
        console.log('');
        console.log(param1.title.bold);
    });

    /**
     * when test passed
     */
    this.on('test:pass', function(param1) {

        // console.log('test:pass');
        testsResults.passed++;

        const text = param1.title;

        console.log((' V'.green + '  ' + text) );
    });

    /**
     * when test failed
     */
    this.on('test:fail', function(param1) {

        var stackParts = [];

        const text = param1.title;

        testsResults.failed++;
        console.log((' X'.red + '  ' + text));

        console.log('');
        console.log(param1.err.message.red.bold);

        stackParts = param1.err.stack.split('at ');

        for(var i=0; i<stackParts.length; i++){

            var msg = stackParts[i].trim();

            if(msg.indexOf('node_modules') === -1 && msg.indexOf('Error:') === -1){
                console.log(msg.red);
            }
        }
        //console.log(('    '+param1.err.stack).red);
        console.log('');

    });

    this.on('test:pending', function() {
        // console.log('test:pending');
    });

    this.on('suite:end', function() {
        // console.log('suite:end');
    });

    this.on('test:start', function() {
        // console.log('test:start');
    });

    this.on('test:end', function() {
        // console.log('test:end');
    });

    this.on('hook:start', function() {
        // console.log('hook:start');
    });

    this.on('hook:end', function() {
        // console.log('hook:end');
    });
};

/**
 * Inherit from EventEmitter
 */
util.inherits(CustomReporter, events.EventEmitter);
CustomReporter.reporterName ='customReporter';

/**
 * Expose Custom Reporter
 */
exports = module.exports = CustomReporter;