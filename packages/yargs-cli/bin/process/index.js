const cp = require('child_process');
const path = require('path')
// cp.exec('ls -al|grep node_modules', function(err, stdout, stderr) {
//   console.log('err: ', err);
//   console.log('stdout: ', stdout);
//   console.log('stderr: ', stderr);
// });

// cp.execFile(path.resolve(__dirname, 'test.shell'), function(err, stdout, stderr) {
//   console.log('err: ', err);
//   console.log('stdout: ', stdout);
//   console.log('stderr: ', stderr);
// });

// 返回子进程
// const child = cp.spawn(path.resolve(__dirname, 'test.shell'), ['-al', '-bl'], {
//   cwd: path.resolve('..')
// });

// const child = cp.spawn('npm', ['install'], {
//   cwd: path.resolve('/Users/wangxuke/wangxuke/wxk_code/study/packages/earth-cli-lib')
// });

// // spawn如何得到结果？如下
// child.stdout.on('data', function(chunk) {
//   console.log(chunk.toString());
// });
// child.stderr.on('data', function(chunk) {
//   console.log(chunk.toString());
// });

// spawn： 耗时任务（比如npm install）, 需要不断日志
// exec/execFile 开销比较小的任务

// cp.exec('npm install', {
//   cwd: path.resolve('/Users/wangxuke/wangxuke/wxk_code/study/packages/earth-cli-lib')
// }, function(err, stdout, stderr) {
//   console.log('err: ', err);
//   console.log('stdout: ', stdout);
//   console.log('stderr: ', stderr);
// });

// fork 创建node子进程
// const child = cp.fork(path.resolve(__dirname, 'child.js'));
// // 进程之间通信
// child.send('hello child process!', () => {
//   // child.disconnect(); // 断开连接
// });

// child.on('message', (msg) => {
//   console.log(msg);
// });

// console.log('main pid', process.pid);

const ret = cp.execSync('ls -al|grep node_modules');
console.log(ret.toString());

const ret2 = cp.execFileSync('ls', ['-al']);
console.log(ret2.toString());

const ret3 = cp.spawnSync('ls', ['-al']);
console.log(ret3.toString());
