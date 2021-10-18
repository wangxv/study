'use strict';

module.exports = core;
const log = require('@earth-cli/log');
const pkg = require('../package.json');

function core() {
	checkPkgVersion();
}

function checkPkgVersion() {
	log.notice('cli', pkg.version);
}
