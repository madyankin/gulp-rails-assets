'use strict';

var crypto        = require('crypto');
var path          = require('path');
var fs            = require('fs');
var gutil         = require('gulp-util');
var through       = require('through2');
var objectAssign  = require('object-assign');
var file          = require('vinyl-file');

var PLUGIN_NAME   = 'gulp-rails-manifest';
var storage = {
  files: {}
};


function getHash(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}


function addToManifest(manifest, firstFile, file, opts) {
  var origPath  = relPath(firstFile.assetOrigBase, file.assetOrigPath);
  var path      = relPath(firstFile.base, file.path);

  manifest.files[path] = {
    'logical_path': origPath,
    'mtime':        new Date(fs.statSync(file.path).mtime).toJSON(),
    'size':         file.contents.length,
    'digest':       getHash(file.contents)
  };
  manifest.assets[origPath] = path;
}


function mergeManifest(oldManifest, manifest, opts) {
  var merged  = {};
  var files   = {};

  merged.assets = objectAssign(oldManifest.assets, manifest.assets);
  files         = objectAssign(oldManifest.files, manifest.files);

  // Remove old keys
  for (var file in files) {
    var key = files[file]['logical_path'];
    if (file != merged.assets[key]) delete files[file];
  }

  merged.files = files;

  return merged;
}


function transformFilename(file) {
  // save the old path for later
  file.assetOrigPath = file.path;
  file.assetOrigBase = file.base;

  var hash      = file.assetHash = getHash(file.contents);
  var ext       = path.extname(file.path);
  var filename  = path.basename(file.path, ext) + '-' + hash + ext;
  file.path     = path.join(path.dirname(file.path), filename);
}


function processFile(file, enc, cb) {
  if (file.isStream()) {
    cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
    return;
  }

  if (file.isNull() || !file.isBuffer()) {
    cb(null, file);
    return;
  }

  var oldPath = file.path
  transformFilename(file);
  storage.files[oldPath] = file.path;

  cb(null, file);
}


function writeManifest(cb) {
  console.log(storage);
  cb();
}


module.exports = function() {
  return through.obj(processFile, writeManifest);
};
