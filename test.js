'use strict';
var path      = require('path');
var crypto    = require('crypto');
var fs        = require('fs');
var assert    = require('assert');
var gutil     = require('gulp-util');

var sourceDir = './test';
var assetsDir = './test/assets';
var destDir   = './tmp';

function getHash(str) {
  return crypto.createHash('md5').update(str).digest('hex').slice(0, 8);
}

it('copies hashed files', function() {
  var files = fs.readdirSync(destDir);
  var hash  = getHash(fs.readFileSync(assetsDir + '/foo.css'));
  assert(files.indexOf('foo-' + hash + '.css') > -1);
});


it('respect directory structure', function() {
  var files = fs.readdirSync(destDir + '/dir');
  var hash  = getHash(fs.readFileSync(assetsDir + '/dir/bar.css'));
  assert(files.indexOf('bar-' + hash + '.css') > -1);
});


it('generates manifest', function() {

});


it('merges manifest with existing one', function() {

});


it('copies only changed files', function() {

});


it('removes old files', function() {

});
