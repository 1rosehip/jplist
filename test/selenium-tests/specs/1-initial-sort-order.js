/**
 * webdriver - http://webdriver.io/guide.html
 * https://github.com/webdriverio/webdriverio/blob/master/examples/wdio/runner-specs/jasmine.spec.js
 * jasmine - http://jasmine.github.io/edge/introduction.html
 * reporter - https://github.com/webdriverio/wdio-dot-reporter
 */
var assert = require('assert');

describe('if no controls -> it should have the same items order as in the view source', function() {

    beforeAll(function(done){

        //navigate to the 1-core.html
        browser.url('/test/pages/1-core.html');
        browser.call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('first item should have title: Calendar', function(){

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[1]')).toBe('Calendar');
    });

    it('second item should have title: Architecture', function(){

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[2]')).toBe('Architecture');
    });

    it('3rd item should have title: Autumn', function(){

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[3]')).toBe('Autumn');
    });

    it('item #4 should have title: Boats', function(){

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[4]')).toBe('Boats');
    });

    it('item #5 should have title: Arch', function(){

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[5]')).toBe('Arch');
    });

    it('item #6 should have title: Books', function(){

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[6]')).toBe('Books');
    });

    it('item #7 should have title: Business', function(){

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[7]')).toBe('Business');
    });

    it('item #8 should have title: Car', function(){

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[8]')).toBe('Car');
    });

    it('item #9 should have title: Christmas', function(){

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[9]')).toBe('Christmas');
    });

    it('item #10 should have title: The Christmas Toy', function(){

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[10]')).toBe('The Christmas Toy');
    });

});