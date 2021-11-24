const { absViewPath } = require("./getPath");
const {join, basename, extname, resolve, relative} = require('path');
const { existsSync, readdirSync, statSync } = require("fs");
const { winPath } = require('./utils');
/**
 * 
 * @param {root} opts 根目录，这是定死的，不会变
 * @param {relDir} opts 代表一个子目录
 */
function getRouter(opts = {}) {
  const {root, relDir = ''} = opts;
  const files = getFiles(join(root, relDir)); // 获取此目录下面的所有文件列表
  const routes = files.reduce(fileToRouteReducer.bind(null, opts), []);
  return routes;
}

// 把文件转为路由的处理器
function fileToRouteReducer(opts, routes, file) {
  const {root, relDir = ''} = opts;
  const absFile = join(root, relDir, file);
  const stats = statSync(absFile);
  if (stats.isDirectory()) {
    const relFile = join(relDir, file); // user
    routes.push({
      path: normalizePath(relFile),
      meta: {},
      routes: getRouter({
        ...opts,
        relDir: relFile
      })
    });
  } else {
    // 文件
    const fileName = basename(file, extname(file));
    routes.push({
      path: normalizePath(join(relDir, fileName)),
      meta: {},
      component: {
        default: toComponentPath(root, absFile)
      }
    });
  }
  return routes;
}

function normalizePath(path) {
  path = winPath(path);
  path = `/${path}`;
  path = path.replace(/\/index$/, '/');
  return path;
}

function toComponentPath(root, absFile) {
  return `@/${winPath(relative(resolve(root, '..'), absFile))}`;
}

function getFiles(root) {
  if (!existsSync(root)) return [];
  return readdirSync(root).filter(file => {
    if (file.charAt(0) === '_' || file.charAt(0) === '.') return false;
    return true;
  })
}

const routes = getRouter({root: absViewPath});
console.log('routes-------: ', JSON.stringify(routes));
module.exports = routes;
