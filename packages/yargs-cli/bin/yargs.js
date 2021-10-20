const yargs = require('yargs/yargs');
// 使文案顶格展示
const dedent = require('dedent');
const { hideBin } = require('yargs/helpers');
const pkg = require('../package.json')

const arg = hideBin(process.argv);
const cli = yargs(arg);

const context = {
  yargsCliVersion: pkg.version
}

const argv = process.argv.slice(2);

cli
  .usage('Usage: $0 [command] <options>')
  .demandCommand(1, 'A command is required. Pass --help to see all available commands and options.')
  .strict()
  .recommendCommands()
  .fail((err, msg) => {
    console.log('err: ', err);
  })
  .alias('h', 'help')
  .alias('v', 'version')
  .wrap(cli.terminalWidth())
  .epilogue(dedent`  这个是一个脚手架
很好用的`)
  .options({
    debug: {
      type: 'boolean',
      describe: 'Bootstrap debug mode',
      alias: 'd'
    }
  })
  // 聚合命令
  .group(['debug'], 'Dev Options:')
  .command('init [name]', 'Do init a project', (yargs) => {
    yargs
      .options('name', {
        type: 'string',
        describe: 'Name of a project',
        alias: 'i'
      });
  }, (argv) => {
    console.log(argv)
  })
  .command({
    command: 'list',
    aliases: ['ls', 'la', 'll'],
    describe: 'List local packages',
    // 执行之前，一些私有的options
    builder: (yargs) => {},
    // 执行脚手架命令
    handler: (argv) => {
      // console.log(argv);
      // console.log('start');
      // setTimeout(() => {
      //   console.log('setTimeout');
      // });
      // new Promise(() => {
      //   let chain = Promise.resolve();
      //   chain.then(() => console.log('chain1'));
      //   chain.then(() => console.log('chain2'));
      //   chain.then(() => console.log('chain3'));
      // })
      // let chain = Promise.resolve();
      // chain.then(() => console.log('chain4'));
      // console.log('end');
     // ^匹配一个空格， (^|\/)匹配一个空格或者/
     // (?:)进行分组，但是不返回分组的内容
      console.log(/(?:^|\/)\.?\.$/.test(''));
    }
  })
  .parse(argv, context);