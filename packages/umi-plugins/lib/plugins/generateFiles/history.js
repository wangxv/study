/**
 * 写入临时文件
 */
const { readFileSync } = require('fs');
const {join} = require('path');
const Mustache = require('mustache');
const writeTmpFile = require('../../writeTmpFile');

const plugin = (pluginAPI) => {
  // 监听一个事件，生成文件
  pluginAPI.onGenerateFiles(async () => {
    const historyTpl = readFileSync(join(__dirname, 'history.tpl'), 'utf-8');
    const content = Mustache.render(historyTpl);
    writeTmpFile({
      path: 'core/history.js',
      content
    });
  });
}

module.exports = plugin;
