'use strict';
const semver = require('semver');
const colors = require('colors/safe');
const LOWST_NODE_VERSION = '12.0.0';
class Command {
  constructor(argv) {
    // console.log('command constructor: ', argv);
    this._argv = argv;
    let runner = new Promise((resolve, reject) => {
      let chain = Promise.resolve();
      chain = chain.then(() => this.checkNodeVersion());
    });
  }

  // 检查node版本
  checkNodeVersion() {
    // 第一步，获取当前Node版本号
    const currentVersion = process.version;
    // 第二步， 比对最低版本
    const lowestVersion = LOWST_NODE_VERSION;

    if (!semver.gte(currentVersion, lowestVersion)) {
      throw new Error(colors.red(`earth-cli 需要安装 v${lowestVersion} 以上版本的 Node.js`));
    }
  }

  init() {
    throw new Error('init必须实现');
  }
  exec() {
    throw new Error('exec必须实现');
  }
}

module.exports = Command;
