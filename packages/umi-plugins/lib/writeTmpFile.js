const mkdirp = require('mkdirp');
const { writeFileSync } = require('fs');
const {dirname, join} = require('path');
const {absTmpPath} = require('./getPath');

/**
 * 向临时文件夹下面写入文件
 * @param {path} 写入的文件路径 
 * @param {content} 写入的文件内容
 */
function writeTmpFile({path, content}) {
  // 获取写入的绝对路径
  const absPath = join(absTmpPath, path);
  // 保证此文件所在的文件夹是存在的，如果不存在则先建立文件夹
  mkdirp(dirname(absPath));

  writeFileSync(absPath, content, 'utf-8');
}

module.exports = writeTmpFile;