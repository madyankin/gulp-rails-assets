'use strict';

var crypto        = require('crypto');
var path          = require('path');
var fs            = require('fs');
var gutil         = require('gulp-util');
var through       = require('through2');
var objectAssign  = require('object-assign');

var PLUGIN_NAME   = 'gulp-rails-manifest';


function getHash(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}


function transformFilename(file) {
  file.assetOrigPath  = file.path;
  var hash            = getHash(file.contents);
  var ext             = path.extname(file.path);
  var filename        = path.basename(file.path, ext) + '-' + hash + ext;
  file.path           = path.join(path.dirname(file.path), filename);
}


function addToManifest(manifest, oldName, file) {
  var name = file.path.replace(file.base, '');
  if (name.indexOf('/') == 0) name = name.slice(1);

  manifest.files[name] = {
    'logical_path': oldName,
    'mtime':        new Date(fs.statSync(file.assetOrigPath).mtime).toJSON(),
    'size':         file.contents.length,
    'digest':       getHash(file.contents)
  };
  manifest.assets[oldName] = name;
}


function mergeManifest(oldManifest, manifest) {
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

    var oldName = file.path.replace(file.base, '');
    transformFilename(file);
    files[oldName] = file;

    cb(null, file);
  }

  function writeManifest(cb) {
    if (!opts.manifest) {
      cb(new gutil.PluginError(PLUGIN_NAME, 'Manifest path not specified'));
      return;
    }

    var manifest = {assets: {}, files: {}};
    for (var file in files) addToManifest(manifest, file, files[file]);
    fs.writeFileSync(opts.manifest, JSON.stringify(manifest, null, '  '));

    cb();
  }

  return through.obj(processFile, writeManifest);
};
