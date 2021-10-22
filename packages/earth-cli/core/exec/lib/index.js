'use strict';

const path = require('path');
const Package = require('@earth-cli/package');
const log = require('@earth-cli/log');

const SETTINGS = {
  init: '@earth-cli/init'
};
const CACHE_DIR = 'depandencies';

async function exec() {
  const homePath = process.env.CLI_HOME_PATH;
  let targetPath = process.env.CLI_TARGET_PATH;
  let storeDir = '';
  let pkg;

  log.verbose('targetPath:', targetPath);
  log.verbose('homePath:', homePath);

  const cmdObj = arguments[arguments.length - 1];
  const cmdName = cmdObj.name();
  const packageName = SETTINGS[cmdName];
  const packageVersion = 'latest';

  if (!targetPath) {
    // 生成缓存路径
    targetPath = path.resolve(homePath, CACHE_DIR);
    storeDir = path.resolve(targetPath, 'node_modules');
    log.verbose('targetPath', targetPath);
    log.verbose('storeDir', storeDir);
    pkg = new Package({
      targetPath,
      packageName,
      packageVersion,
      storeDir
    });
    if (await pkg.exists()) {
      // 更新
      await pkg.update();
    } else {
      // 安装
      await pkg.install();
    }
  } else {
    pkg = new Package({
      targetPath,
      packageName,
      packageVersion
    });
  }

  const rootFile = pkg.getRootFilePath();
  if (rootFile) {
    // 在当前进程中调用
    require(rootFile).call(null, Array.from(arguments));

    // 在node子进程中调用
    
  }
}
module.exports = exec;
