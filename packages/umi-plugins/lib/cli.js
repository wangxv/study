const Service = require('./Service');
const pluginDev = require('./plugins/commands/dev');
const pluginHistory = require('./plugins/generateFiles/history');
const pluginRoutes = require('./plugins/generateFiles/routes');

(async function() {
  const service = new Service({
    plugins: [
      { id: 'dev', apply: pluginDev },
      { id: 'history', apply: pluginHistory },
      { id: 'routes', apply: pluginRoutes },
    ]
  });
  await service.run({name: 'dev'});
})();
