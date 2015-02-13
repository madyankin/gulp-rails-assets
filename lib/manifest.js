'use strict';
var objectAssign  = require('object-assign');
var helpers       = require('./helpers');
var fs            = require('fs');

module.exports = function(data) {

  var manifest;

  if ('assets' in data && 'files' in data) {
    manifest = data;
  } else {
    manifest = {assets: {}, files: {}};
    for (var file in data) add(data[file]);
  }


  function add(file) {
    var name = file.newName;
    if (name.indexOf('/') == 0) name = name.slice(1);

    manifest.files[name] = {
      'logical_path': file.oldName,
      'mtime':        new Date(file.mtime).toJSON(),
      'size':         file.size,
      'digest':       file.hash
    };
    manifest.assets[file.oldName] = name;
  }


  function merge(other) {
    // Remove old keys
    // for (var file in files) {
    //   var key = files[file]['logical_path'];
    //   if (file != merged.assets[key]) delete files[file];
    // }
    manifest.assets = objectAssign(manifest.assets, other.assets);
    manifest.files  = objectAssign(manifest.files, other.files);
    return manifest;
  }


  function toString() {
    return JSON.stringify(manifest, null, '  ');
  }

  function toJSON() {
    return manifest;
  }


  return {
    merge: merge,
    toString: toString,
    toJSON: toJSON
  };

}
