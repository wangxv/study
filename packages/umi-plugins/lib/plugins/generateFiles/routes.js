/**
 * 写入临时文件
 */
 const { readFileSync } = require('fs');
 const {join} = require('path');
 const Mustache = require('mustache');
 const writeTmpFile = require('../../writeTmpFile');
 const routes = require('../../getRoutes');
 
 const plugin = (pluginAPI) => {
   // 监听一个事件，生成文件
   pluginAPI.onGenerateFiles(async () => {
     const routesTpl = readFileSync(join(__dirname, 'routes.tpl'), 'utf-8');
     const content = Mustache.render(routesTpl, {
       routes: JSON.stringify(routes, replacer, 2)
     });
     console.log('content----: ', content);
     writeTmpFile({
       path: 'core/routes.js',
       content
     });
   });
 }

 function replacer(key, value) {
   if (key === 'default') {
    return `default: import(${key})`;
   }
   return value;
 }
 
 module.exports = plugin;
 