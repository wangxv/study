const request = require('@earth-cli/request');

module.exports = function() {
  return request({
    url: '/project/template'
  });
};
