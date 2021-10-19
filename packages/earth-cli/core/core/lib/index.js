'use strict';

module.exports = core;

const path = require('path');
const semver = require('semver');
const colors = require('colors/safe');
const pathExists = require('path-exists').sync;
const userHome = require('user-home');
const log = require('@earth-cli/log');
const pkg = require('../package.json');
const constant = require('./const');

let args;

async function core() {
	try {
		checkPkgVersion();
		checkNodeVersion();
		checkRoot();
		checkUserHome();
		checkInputArgs();
		checkEnv();
		checkGlobalUpdate();
	} catch(err) {
		log.error(err.message);
	}
}

// 检查更新
async function checkGlobalUpdate() {
	// 1. 获取当前版本号和模块名
	const currentVersion = pkg.version;
	const npmName = pkg.name;
	// 2. 调用npm API, 获取所有版本号 【https://registry.npmjs.org/@earth-cli/core】
	// 3.提取所有版本号，比对那些版本号是大于当前版本号
	// 4.获取最新的版本号，提示用户更新到该版本
	const { getNpmSemverVersion } = require('@earth-cli/get-npm-info')
	const lastVersion = await getNpmSemverVersion(currentVersion, npmName);
	if (lastVersion && semver.gt(lastVersion, currentVersion)) {
		log.warn('更新提示', colors.yellow(`请手动更新 ${npmName}，当前版本: ${currentVersion}，最新版本: ${lastVersion}
更新命令: npm install -g ${npmName}`));
	}

}

// 检查环境变量
function checkEnv() {
	const dotenv = require('dotenv');
	const dotenvPath = path.resolve(userHome, '.env');
	if (pathExists(dotenvPath)) {
		dotenv.config({
			path: dotenvPath
		});
	}
	createDefaultCliConfig();
  log.verbose('环境变量', process.env.CLI_HOME_PATH);
}

// 创建默认cli配置
function createDefaultCliConfig() {
	const cliConfig = {
		home: userHome
	};

	if (process.env.CLI_HOME) {
		cliConfig['cliHome'] = path.join(userHome, process.env.CLI_HOME);
	} else {
		cliConfig['cliHome'] = path.join(userHome, constant.DEFAULT_CLI_HOME);
	}
	process.env.CLI_HOME_PATH = cliConfig.cliHome;
}

// 检查入参
function checkInputArgs() {
	const minimist = require('minimist');
	args = minimist(process.argv.slice(2));
	checkArgs();
}

function checkArgs() {
	if (args.debug) {
		process.env.LOG_LELVEL = 'verbose';
	} else {
		process.env.LOG_LELVEL = 'info';
	}
	log.level = process.env.LOG_LELVEL;
}
// 检查package的版本
function checkPkgVersion() {
	log.info('cli', pkg.version);
}
// 检查node版本
function checkNodeVersion() {
	// 第一步，获取当前Node版本号
	console.log(process.version);
	const currentVersion = process.version;
	// 第二步， 比对最低版本
	const lowestVersion = constant.LOWST_NODE_VERSION;

	if (!semver.gte(currentVersion, lowestVersion)) {
		throw new Error(colors.red(`earth-cli 需要安装 v${lowestVersion} 以上版本的 Node.js`));
	}
}
// 检查root权限
function checkRoot() {
	const rootCheck = require('root-check');
	rootCheck();
	console.log(process.getuid());
}
// 检查主目录
function checkUserHome() {
	if (!userHome || !pathExists(userHome)) {
		throw new Error(colors.red('当前登录用户主目录不存在！'));
	}
}