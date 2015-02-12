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

  return {
    newName:  newPath().replace(file.base, ''),
    oldName:  originalPath.replace(file.base, ''),
    newPath:  newPath(),
    mtime:    fs.statSync(originalPath).mtime,
    hash:     hash,
    size:     file.contents.length
  }

}
