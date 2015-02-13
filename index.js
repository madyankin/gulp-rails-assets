'use strict';

var fs            = require('fs');
var gutil         = require('gulp-util');
var through       = require('through2');
var objectAssign  = require('object-assign');
var manifest      = require('./lib/manifest');
var fileData      = require('./lib/file');
var PLUGIN_NAME   = 'gulp-rails-manifest';


module.exports = function(opts) {
  var opts  = opts || {};
  var files = {};

  function processFile(file, enc, cb) {
    if (file.isStream()) {
      cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
      return;
    }

    if (file.isNull() || !file.isBuffer()) {
      cb(null, file);
      return;
    }

    var fileObject  = fileData(file);
    file.path       = fileObject.newPath;
    files[fileObject.oldName] = fileObject;

    cb(null, file);
  }

  function writeManifest(cb) {
    if (!opts.manifest) {
      cb(new gutil.PluginError(PLUGIN_NAME, 'Manifest path not specified'));
      return;
    }

    fs.exists(opts.manifest, function(exists) {
      var newManifest = manifest(files);

      if (exists) {
        var existingManifest = manifest(require(opts.manifest));
        existingManifest.merge(newManifest.toJSON());
        newManifest = existingManifest;
      }

      fs.writeFileSync(opts.manifest, newManifest.toString());
      cb();
    });
  }

  return through.obj(processFile, writeManifest);
};
