'use strict';
const log = require('@earth-cli/log');
const Command = require('@earth-cli/command');

class InitCommand extends Command {
  init() {
    this.projectName = this._argv[0] || '';
    this.force = !!this._options.force;
    log.verbose('projectName: ', this.projectName);
    log.verbose('force: ', this.force);
  }
  exec() {
    console.log('exec');
  }
}

function init(argv) {
  return new InitCommand(argv);
}

module.exports = init;
module.exports.InitCommand = InitCommand;
