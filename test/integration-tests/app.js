//http://docs.casperjs.org/en/latest/testing.html#testing

/*
casper.test.begin('Google tests', function(test){
    casper.start('http://www.google.com', function(){
        test.assertTitleMatch(/Google/, 'Title contains Google');
    }).run(function(){
        test.done();
    });
});
*/

// hello-test.js
casper.test.begin("Hello, Test!", 1, function(test) {
  test.assert(true);
  test.done();
});

// hello-test.js
casper.test.begin("Hello, Test!", 1, function(test) {
  test.assert(false);
  test.done();
});