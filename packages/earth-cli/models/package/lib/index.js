'use strict';

const path = require('path');
const pkgDir = require('pkg-dir').sync;
const { isObject } = require('@earth-cli/utils');
const formatPath = require('@earth-cli/format-path');
/**
 * 1.targetPath -> moudulePath
 * 2. modulePath -> Package(npm模块)
 * 3.Package.getRootFile(获取入口文件)
 * 4.Package.update / Package.init
 * 
 * 封装 -> 复用
 */
class Package {
  constructor(options) {
    if (!options) {
      throw new Error('Package类的options参数不能为空！');
    }
    if (!isObject(options)) {
      throw new Error('Package类的options参数必须为对象！');
    }

    // package的路径
    this.targetPath = options.targetPath;
    // package的name
    this.packageName = options.packageName;
    // package的version
    this.packageVersion = options.packageVersion;
  }
  // 当前package是否存在
  exists() {

  }
  // 安装package
  install() {

  }
  // 更新package
  update() {

  }
  // 获取根文件路径
  getRootFilePath() {
    // 1. 获取package.json的所在目录 -- pkg-dir 
    const dir = pkgDir(this.targetPath);
    if (dir) {
      // 2.读取package.json --require()
      const pkgFile =require(path.resolve(dir, 'package.json'));
      // 3. 寻找main/lib -path
      if (pkgFile && pkgFile.main) {
        // 4. 路径的兼容（macOS/windows）
        return formatPath(path.resolve(dir, pkgFile.main));
      }
    }
    return null;
  }
}

module.exports = Package;
