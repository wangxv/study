'use strict';

module.exports = core;

const path = require('path');
const semver = require('semver');
const commander = require('commander');
const colors = require('colors/safe');
const pathExists = require('path-exists').sync;
const userHome = require('user-home');
const log = require('@earth-cli/log');
const pkg = require('../package.json');
const constant = require('./const');
const exec = require('@earth-cli/exec');

const program = new commander.Command();

async function core() {
	try {
		await prepare();
		registerCommand();
	} catch(err) {
		log.error(err.message);
		if (process.env.LOG_LELVEL === 'verbose') {
			console.log(err);
		}
	}
}

// 注册命令
function registerCommand() {

	program
		.name(Object.keys(pkg.bin)[0])
		.usage('<command> [options]')
		.version(pkg.version)
		.option('-d, --debug', '是否开启调试模式', false)
		.option('-tp, --targetPath <targetPath>', '是否指定本地调试路径', '');
	
	program
		.command('init [projectName]')
		.option('-f, --force', '是否强制初始化项目')
		.action(exec);
	// 开启debug模式
	program.on('option:debug', function() {
		if (this.opts().debug) {
			process.env.LOG_LELVEL = 'verbose';
		} else {
			process.env.LOG_LELVEL = 'info';
		}
		log.level = process.env.LOG_LELVEL;
	});

	// 指定targetPath
	program.on('option:targetPath', function() {
		if (this.opts && this.opts()) {
			process.env.CLI_TARGET_PATH = this.opts().targetPath;
		}
	});

	// 对未知命令监听
	program.on('command:*', function(obj) {
		console.log(colors.red('未知命令：' + obj[0]));
		const availableCommands = program.commands.map(cmd => cmd.name());
		console.log(colors.red('可用命令：' + availableCommands.join(',')))
	});

	program.parse(process.argv);
	if (process.args && program.args.length < 1) {
		program.outputHelp();
	}
}

async function prepare() {
	checkPkgVersion();
	checkRoot();
	checkUserHome();
	checkEnv();
	// await checkGlobalUpdate();
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

// 检查package的版本
function checkPkgVersion() {
	// log.info('cli', pkg.version);
}

// 检查root权限
function checkRoot() {
	const rootCheck = require('root-check');
	rootCheck();
}
// 检查主目录
function checkUserHome() {
	if (!userHome || !pathExists(userHome)) {
		throw new Error(colors.red('当前登录用户主目录不存在！'));
	}
}
