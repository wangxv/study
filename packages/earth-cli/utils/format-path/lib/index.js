'use strict';

const path = require('path');

function formatPath(p) {
  if (p) {
    // 斜杠的问题 mac windows
    const sep = path.sep;
    if (sep === '/') {
      return p;
    } else {
      return p.replace(/\\/g, '/');
    }
  }

  return p;
}

module.exports = formatPath;
