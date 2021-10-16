#!/usr/bin/env node

const yargs = require('yargs/yargs');
// 使文案顶格展示
const dedent = require('dedent');
const { hideBin } = require('yargs/helpers');
const arg = hideBin(process.argv);

const cli = yargs(arg);
cli
  .usage('Usage: yargs-cli [command] <options>')
  .demandCommand(1, 'A command is required. Pass --help to see all available commands and options.')
  .strict()
  .alias('h', 'help')
  .alias('v', 'version')
  .wrap(cli.terminalWidth())
  .epilogue(dedent`   aa
 aa`)
  .argv;