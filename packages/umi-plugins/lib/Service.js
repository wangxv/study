/**
 * 插件的核心
 */

const { AsyncParallelHook } = require('tapable');
const PluginAPI = require('./PluginAPI');

class Service{
  constructor(opts) {
    this.commands = {}; // 存放所有命令和它们的实现
    this.plugins = opts.plugins;
    this.hooksByPluginId = {}; // 安插件ID绑定的钩子
    this.hooks = {}; // 按类型分类
  }
  async run(args) {
    this.init();
    return this.runCommand(args);
  }

  async init() {
    // 挂载所有插件
    for (let plugin of this.plugins) {
      const pluginAPI = new PluginAPI({id: plugin.id, service: this});
      pluginAPI.onGenerateFiles = (fn) => {
        pluginAPI.register({
          pluginId: plugin.id,
          key: 'onGenerateFiles',
          fn
        });
      };
      plugin.apply(pluginAPI);
    }

    Object.keys(this.hooksByPluginId).forEach(pluginId => {
      const pluginHooks = this.hooksByPluginId[pluginId];
      pluginHooks.forEach(hook => {
        const { key } = hook;
        this.hooks[key] = (this.hooks[key] || []).concat(hook);
      });
    });
  }

  async applyPlugins(opts) {
    const hooksForKey = this.hooks[opts.key] || [];
    // AsyncParallelHook 并行    AsyncSeriesWaterfallHook 串行
    const tEvent = new AsyncParallelHook(['_']);
    for (const hook of hooksForKey) {
      tEvent.tapPromise({name: hook.pluginId}, hook.fn);
    }
    return await tEvent.promise();
  }

  async runCommand({name}) {
    const command = this.commands[name];
    return command.fn();
  }
}

module.exports = Service;
