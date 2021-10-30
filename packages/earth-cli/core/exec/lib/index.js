'use strict';

const path = require('path');
// const cp = require('child_process');
const Package = require('@earth-cli/package');
const log = require('@earth-cli/log');
const { exec: spawn } = require('@earth-cli/utils');

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
    try {
      // 在当前进程中调用
      // require(rootFile).call(null, Array.from(arguments));

      // 在node子进程中调用
      const args =  Array.from(arguments);
      const cmd = args[args.length - 1];
      const o = Object.create(null);
      Object.keys(cmd).forEach(key => {
        if (cmd.hasOwnProperty(key) && !key.startsWith('_') && key !== 'parent') {
          o[key] = cmd[key];
        }
      });

      args[args.length - 1] = o;

      const code = `require('${rootFile}').call(null, Array.from(${JSON.stringify(args)}));`;
      const child = spawn('node', ['-e', code], {
        cwd: process.cwd(),
        stdio: 'inherit'
      });
      child.on('error', e => {
        log.error(e.message);
        process.exit(1);
      });
      child.on('exit', e => {
        log.verbose('命令执行成功：' + e);
        process.exit(e);
      });
    } catch (e) {
      log.error(e.message);
    }    
  }
}

module.exports = exec;
