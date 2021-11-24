const { existsSync, statSync } = require('fs');
const { join } = require('path');

function isDirectoryAndExist(path) {
  // 判断某个路径的文件是否存在，并且是一个目录【文件夹】
  return existsSync(path) && statSync(path).isDirectory();
}

// 获取当前工作目录
const cwd = process.cwd();

// src目录的绝对路径
let absSrcPath = cwd;
// 如果src目录存在，那么当前目录下的src目录才是src根目录
if (isDirectoryAndExist(join(absSrcPath, 'src'))) {
  absSrcPath = join(absSrcPath, 'src');
}

const absViewPath = join(absSrcPath, 'views');
const temDir = '.umi3';
const absTmpPath = join(absSrcPath, temDir);

module.exports = {
  absSrcPath, // SRC根目录的绝对路径
  absViewPath, // 约定式路由 pages目录下面的view的路径
  temDir, // 临时文件名 
  absTmpPath, // 临时路径， 绝对路径
};
