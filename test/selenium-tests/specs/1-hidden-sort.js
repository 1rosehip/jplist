var assert = require('assert');

describe('hidden sort desc', function() {

    beforeAll(function(done){

        //navigate to the 1-hidden-sort.html
        browser.url('/test/pages/1-hidden-sort.html');
        browser.call(done);
    });

    afterAll(function(done){

        browser.end(done);
    });

    it('first item should have title: Wood', function(){

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[1]')).toBe('Wood');
    });

    it('second item should have title: Winter Sun', function(){

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[2]')).toBe('Winter Sun');
    });

    it('3rd item should have title: Winter', function(){

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[3]')).toBe('Winter');
    });

    it('item #4 should have title: Tree', function(){

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[4]')).toBe('Tree');
    });

    it('item #5 should have title: The Christmas Toy', function(){

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[5]')).toBe('The Christmas Toy');
    });

    it('item #6 should have title: Sunset', function(){

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[6]')).toBe('Sunset');
    });

    it('item #7 should have title: Seesaw', function(){

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[7]')).toBe('Seesaw');
    });

    it('item #8 should have title: Rivers', function(){

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[8]')).toBe('Rivers');
    });

    it('item #9 should have title: River Source', function(){

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[9]')).toBe('River Source');
    });

    it('item #10 should have title: Pseudanthium', function(){

        expect(browser.getText('(//div[@class="list-item box"]//p[@class="title"])[10]')).toBe('Pseudanthium');
    });

});