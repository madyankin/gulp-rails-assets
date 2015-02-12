var crypto = require('crypto');

module.exports = {
  hash: function hash(str) {
    return crypto.createHash('md5').update(str).digest('hex');
  }
};
