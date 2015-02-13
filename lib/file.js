'use strict';
var fs      = require('fs');
var path    = require('path');
var helpers = require('./helpers');


module.exports = function(file) {
  var file          = file;
  var originalPath  = file.path;
  var hash          = helpers.hash(file.contents);

  function newPath() {
    var ext       = path.extname(originalPath);
    var filename  = path.basename(originalPath, ext) + '-' + hash + ext;
    return path.join(path.dirname(originalPath), filename);
  }

  function name(name) {
    var name = name.replace(file.base, '');
    if (name.indexOf('/') == 0) name = name.slice(1);
    return name;
  }

  function mtime() {
    try {
      return fs.statSync(file.path).mtime;
    } catch(e) {
      return new Date();
    }
  }

  return {
    newName:  name(newPath()),
    oldName:  name(originalPath),
    newPath:  newPath(),
    mtime:    mtime(),
    hash:     hash,
    size:     file.contents.length
  }

}
