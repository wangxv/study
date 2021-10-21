'use strict';

const path = require('path');
const npminstall = require('npminstall');
const fse = require('fs-extra');
const pathExists = require('path-exists').sync;
const pkgDir = require('pkg-dir').sync;
const { isObject } = require('@earth-cli/utils');
const formatPath = require('@earth-cli/format-path');
const { getDefaultRegistry, getNpmLatestVersion } = require('@earth-cli/get-npm-info');
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
    // 缓存路径
    this.storeDir = options.storeDir;
    // package的name
    this.packageName = options.packageName;
    // package的version
    this.packageVersion = options.packageVersion;
    // package的缓存目录前缀
    this.cacheFilePathPrefix = this.packageName.replace('/', '_');
  }

  async prepare() {
    // 如果storeDir目录不存在，就创建一个
    if (this.storeDir && !pathExists(this.storeDir)) {
      fse.mkdirpSync(this.storeDir);
    }

    if (this.packageVersion === 'latest') {
      this.packageVersion = await getNpmLatestVersion(this.packageName);
    }
    // 转换路径
    // _@earth-cli_init@1.0.0@@earth-cli  目标
    // @earth-cli/init 1.0.0  现有
  }

  get cacheFilePath() {
    return this.getSpecificCacheFilePath(this.packageVersion);
  }

  getSpecificCacheFilePath(packageVersion) {
    return path.resolve(this.storeDir, `_${this.cacheFilePathPrefix}@${packageVersion}@${this.packageName}`);
  }

  // 当前package是否存在
  async exists() {
    if (this.storeDir) {
      await this.prepare();
      return pathExists(this.cacheFilePath);
    } else {
      return pathExists(this.targetPath);
    }
  }
  // 安装指定版本的包
  async installSpecific(packageVersion) {
    await npminstall({
      root: this.targetPath, // 模块路径
      storeDir: this.storeDir,
      registry: getDefaultRegistry(),
      pkgs: [
        { 
          name: this.packageName,
          version: packageVersion
        }
      ]
    });
  }
  // 安装package
  async install() {
    await this.prepare();
    await this.installSpecific(this.packageVersion);
  }
  // 更新package
  async update() {
    await this.prepare();
    // 1、获取最新的npm模块版本号
    const latestPackageVersion = await getNpmLatestVersion(this.packageName)
    // 2、查询最新办报备号对应的路径是否存在
    const latestFilePath = this.getSpecificCacheFilePath(latestPackageVersion);
    // 3、如果不存在，则直接安装最新版本
    if (!pathExists(latestFilePath)) {
      await installSpecific(latestPackageVersion);
      this.packageVersion = latestPackageVersion;
    }
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
