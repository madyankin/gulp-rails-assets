'use strict';
var path      = require('path');
var fs        = require('fs');
var assert    = require('assert');
var gutil     = require('gulp-util');
var helpers   = require('./lib/helpers');
var fileData  = require('./lib/file');
var manifest  = require('./lib/manifest');

var sourceDir = './test';
var assetsDir = './test/assets/';
var destDir   = './tmp';


it('copies hashed files', function() {
  var files = fs.readdirSync(destDir);
  var hash = helpers.hash(fs.readFileSync(assetsDir + '/foo.css'));
  assert(files.indexOf('foo-' + hash + '.css') > -1);
});


it('respect directory structure', function() {
  var files = fs.readdirSync(destDir + '/dir');
  var hash  = helpers.hash(fs.readFileSync(assetsDir + '/dir/bar.css'));
  assert(files.indexOf('bar-' + hash + '.css') > -1);
});


it('builds correct file data', function() {
  var filepath  = path.resolve(assetsDir + 'foo.css');
  var mtime     = fs.statSync(filepath).mtime;

  var file = new gutil.File({
    path: filepath,
    base: path.resolve(assetsDir),
    contents: new Buffer('.foo {}\n')
  });

  var expected = {
    newName:  'foo-a54dd39f86b3ef34bc57c1d778476f7f.css',
    oldName:  'foo.css',
    newPath:  path.resolve(assetsDir + 'foo-a54dd39f86b3ef34bc57c1d778476f7f.css'),
    mtime:    mtime,
    hash:     'a54dd39f86b3ef34bc57c1d778476f7f',
    size:     8
  }

  assert.deepEqual(fileData(file), expected);
});


it('builds manifest', function() {
  var files     = require('./test/files.json');
  var expected  = require('./test/manifest.expected.json');
  var res       = manifest(files).toJSON();
  assert.deepEqual(res, expected);
});


it('saves manifest', function() {
  var files = fs.readdirSync(destDir);
  assert(files.indexOf('manifest.json') > -1);
});


it('merges manifest with existing one', function() {
  var files           = require('./test/files.json');
  var filesMerge      = require('./test/files-merge.json');
  var expected        = require('./test/manifest-merge.expected.json');
  var manifestObject  = manifest(files);
  var res             = manifestObject.merge(manifest(filesMerge))

  assert.deepEqual(res, expected);
});


it('removes old files', function() {

});
