#!/usr/bin/env node

const commander = require('commander');
const pkg = require('../package.json');

// 直接获取commander的单例
// const {program} = commander;
// 手动实例化一个Command示例
const program = new commander.Command();

// program
//   .name(Object.keys(pkg.bin)[0])
//   .usage('<command> [options]')
//   .version(pkg.version)
//   .option('-d, --debug', '是否开启提示模式', false)
//   .option('-e, --env <envName>', '获取环境变量名称');

//command 注册命令
const clone = program.command('clone <source> [destination]');
clone
  .description('clone a repository')
  .option('-f, --force', '是否强制克隆')
  .action((source, destination, cmdObj) => {
    console.log('do clone', source, destination, cmdObj.force);
  });



// addCommand 注册子命令
const service = new commander.Command('service');
service
  .command('start [port]')
  .description('start service at some port')
  .action((port) => {
    console.log('do service start', port);
  });
service
  .command('stop')
  .description('stop service')
  .action(() => {
    console.log('stop service');
  });
program.addCommand(service);
// program
//   .command('install [name]', 'install package', {
//     executableFile: 'earth-cli',
//     // isDefault: true // 给脚手架设置默认命令
//     // hidden: true // 隐藏命令
//   })
//   .alias('i');

// program
//   .arguments('<cmd> [options]')
//   .description('test command', {
//     cmd: 'command to run',
//     options: 'options for command'
//   })
//   .action(function(cmd, options) {
//     console.log(cmd, options);
//   })


// 高级定制1： 自定义help信息
// program.helpInformation = function() {return ''};
// program.on('--help', function() {
//   console.log('your help infomation');
// });

// 高级定制2：自定义debug模式
// program.on('option:debug', function() {
//   console.log('debug', program.debug);
//   if (program.debug) {
//     process.env.LOG_LEVEL = 'verbose';
//   }
//   console.log(process.env.LOG_LEVEL);
// });
// 高级定制3： 对未知命令监听
program.on('command:*', function(obj) {
  console.log(obj);
  console.error('未知命令：' + obj[0]);
  const availableCommands = program.commands.map(cmd => cmd.name());
  console.log('可用命令：' + availableCommands.join(','))
});

program.parse(process.argv);
