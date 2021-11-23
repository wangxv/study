const express = require('express');
const http = require('http');

class Server {
  constructor() {
    this.app = express();
  }

  async start() {
    const listeningApp = http.createServer(this.app);
    listeningApp.listen(8004, () => {
      console.log('服务器已经在8004端口上启动了！');
    });
  }
}

module.exports = Server;
