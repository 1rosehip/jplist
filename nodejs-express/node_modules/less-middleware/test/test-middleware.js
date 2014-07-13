"use strict";

var express = require('express');
var fs = require('fs');
var middleware = require('../lib/middleware');
var os = require('os');
var request = require('supertest');
var assert = require('assert');

var tmpDest = __dirname + '/artifacts';
var clearCache = function(filename) {
  if(fs.existsSync(tmpDest + '/' + filename)) {
    // Unlinking file since it is cached without reguard to params.
    // TODO: Remove when the imports cache is aware of params.
    fs.unlinkSync(tmpDest + '/' + filename);
  }
};

describe('middleware', function(){
  describe('simple', function(){
    var app = express();
    app.use(middleware(__dirname + '/fixtures', {
      dest: tmpDest
    }));
    app.use(express.static(tmpDest));

    it('should process simple less files', function(done){
      var expected = fs.readFileSync(__dirname + '/fixtures/simple-exp.css', 'utf8');
      request(app)
        .get('/simple.css')
        .expect(200)
        .expect(expected, done);
    });
  });

  describe('import', function(){
    var app = express();
    app.use(middleware(__dirname + '/fixtures', {
      dest: tmpDest
    }));
    app.use(express.static(tmpDest));

    it('should process less files with imports', function(done){
      var expected = fs.readFileSync(__dirname + '/fixtures/importSimple-exp.css', 'utf8');
      request(app)
        .get('/importSimple.css')
        .expect(200)
        .expect(expected, done);
    });

    it('should process less files with nested imports', function(done){
      var expected = fs.readFileSync(__dirname + '/fixtures/import-exp.css', 'utf8');
      request(app)
        .get('/import.css')
        .expect(200)
        .expect(expected, done);
    });
  });

  describe('options', function(){
    describe('postprocess', function(){
      describe('css', function(){
        var app = express();
        app.use(middleware(__dirname + '/fixtures', {
          dest: tmpDest,
          postprocess: {
            css: function(css, req) {
              return '/* Prepended Comment */\n' + css;
            }
          }
        }));
        app.use(express.static(tmpDest));

        it('should prepend the comment on all output css', function(done){
          var expected = fs.readFileSync(__dirname + '/fixtures/postprocessCss-exp.css', 'utf8');
          request(app)
            .get('/postprocessCss.css')
            .expect(200)
            .expect(expected, done);
        });
      });
    });

    describe('preprocess', function(){
      describe('less', function(){
        var app = express();
        app.use(middleware(__dirname + '/fixtures', {
          dest: tmpDest,
          preprocess: {
            less: function(src, req) {
              if (req.param("namespace")) {
                src = req.param("namespace") + " { " + src + " }";
              }
              return src;
            }
          }
        }));
        app.use(express.static(tmpDest));

        it('should add namespace when found', function(done){
          var expected = fs.readFileSync(__dirname + '/fixtures/preprocessLess-exp-a.css', 'utf8');
          clearCache('preprocessLess.css');
          request(app)
            .get('/preprocessLess.css?namespace=h1')
            .expect(200)
            .expect(expected, done);
        });

        it('should not add namespace when none provided', function(done){
          var expected = fs.readFileSync(__dirname + '/fixtures/preprocessLess-exp-b.css', 'utf8');
          clearCache('preprocessLess.css');
          request(app)
            .get('/preprocessLess.css')
            .expect(200)
            .expect(expected, done);
        });
      });

      describe('path', function(){
        var app = express();
        app.use(middleware(__dirname + '/fixtures', {
          dest: tmpDest,
          preprocess: {
            path: function(pathname, req) {
              return pathname.replace('.ltr', '');
            }
          }
        }));
        app.use(express.static(tmpDest));

        it('should remove .ltr from the less path when found', function(done){
          var expected = fs.readFileSync(__dirname + '/fixtures/preprocessPath-exp.css', 'utf8');
          request(app)
            .get('/preprocessPath.ltr.css')
            .expect(200)
            .expect(expected, done);
        });

        it('should not change less path when no matching .ltr', function(done){
          var expected = fs.readFileSync(__dirname + '/fixtures/preprocessPath-exp.css', 'utf8');
          request(app)
            .get('/preprocessPath.css')
            .expect(200)
            .expect(expected, done);
        });
      });

      describe('pathRoot', function(){
        var app = express();
        app.use(middleware('/fixtures', {
          dest: '/artifacts',
          pathRoot: __dirname
        }));
        app.use(express.static(tmpDest));

        it('should process simple less files', function(done){
          var expected = fs.readFileSync(__dirname + '/fixtures/pathRoot-exp.css', 'utf8');
          request(app)
            .get('/pathRoot.css')
            .expect(200)
            .expect(expected, done);
        });
      });
    });
  });
});
