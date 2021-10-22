console.log('child process');

console.log('child pid', process.pid);

// 接收通信消息
process.on('message', (msg) => {
  console.log(msg);
});

process.send('hello main process!');
