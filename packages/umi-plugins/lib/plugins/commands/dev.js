const Server = require('../../Server');

const plugin = (pluginAPI) => {
  // 注册命令
  pluginAPI.registerCommand({
    name: 'dev',
    description: '启动服务',
    fn: async function() {
      await pluginAPI.service.applyPlugins({
        key: 'onGenerateFiles'
      });
      const server = new Server();
      await server.start();
    }
  })
};

module.exports = plugin;

