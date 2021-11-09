'use strict';
const fs = require('fs');
const path = require('path');
const userHome = require('user-home')
const inquirer = require('inquirer');
const semver = require('semver');
const fse = require('fs-extra');
const glob = require('glob');
const ejs = require('ejs');
const log = require('@earth-cli/log');
const { spinnerStart, sleep, execAsync } = require('@earth-cli/utils');
const Command = require('@earth-cli/command');
const Package = require('@earth-cli/package');

const getProjectTemplate = require('./getProjectTemplate');

const TYPE_PROJECT = 'project';
const TYPE_COMPONENT = 'component';
const TEMPLATE_TYPE_NORMAL = 'normal';
const TEMPLATE_TYPE_CUSTOM = 'custom';
const WHITE_COMMAND = ['npm', 'cnpm'];

class InitCommand extends Command {
  init() {
    this.projectName = this._argv[0] || '';
    this.force = !!this._options.force;
    log.verbose('projectName: ', this.projectName);
    log.verbose('force: ', this.force);
  }
  async exec() {
    try {
      // 1、准备阶段
      const projectInfo = await this.prepare();
      if (projectInfo) {
        // 2、下载模板
        log.verbose('projectInfo', projectInfo);
        this.projectInfo = projectInfo;
        await this.downloadTemplate();
        // 3、安装模板  
        await this.installTemplate();
      }
    } catch (e) {
      log.error(e.message);
      if (process.env.LOG_LEVEL === 'verbose') {
        console.log(e);
      }
    }
  }

  async installTemplate() {
    log.verbose('templateInfo', this.templateInfo);
    if (this.templateInfo ) {
      if (!this.templateInfo.type) {
        this.templateInfo.type = TEMPLATE_TYPE_NORMAL;
      }
      if (this.templateInfo.type === TEMPLATE_TYPE_NORMAL) {
        // 标准安装
        await this.installNormalTemplate();
      } else if (this.templateInfo.type === TEMPLATE_TYPE_CUSTOM) {
        // 自定义安装
        await this.installCustomTemplate();
      } else {
        throw new Error('无法识别项目模板类型！');
      }
    } else {
      throw new Error('项目模板不存在！');
    }
  }
  
  // 校验命令
  checkCommand(cmd) {
    if (WHITE_COMMAND.includes(cmd)) {
      return cmd;
    }
    return null;
  }

  async execCommand(command, errMsg) {
    let ret;
    if (command) {
      let cmdArray = command.split(' ');
      if (cmdArray.length > 0) {
        const cmd = this.checkCommand(cmdArray[0]);
        if (!cmd) {
          throw new Error('命令不存在！命令：' + command);
        }
        const args = cmdArray.slice(1);
        ret = await execAsync(cmd, args, {
          stdio: 'inherit',
          cwd: process.cwd()
        });
      }
    }
    if (ret !== 0) {
      throw new Error(errMsg);
    }
    return ret;
  }

  async ejsRender(option) {
    const dir = process.cwd();
    const projectInfo = this.projectInfo;
    return new Promise((resolve, reject) => {
      glob('**', {
        cwd: dir,
        ignore: option.ignore || '',
        nodir: true
      }, (err, files) => {
        if (err) {
          reject(err);
        } else {
          Promise.all(files.map(file => {
            const filePath = path.join(dir, file);
            return new Promise((resolve1, reject1) => {
              ejs.renderFile(filePath, projectInfo, {}, (err, result) => {
                if (err) {
                  reject1(err);
                } else {
                  fse.writeFileSync(filePath, result);
                  resolve1(result);
                }
              })
            });
          })).then(() => {
            resolve();
          }).catch(err => {
            reject(err);
          });
        }
      });
    });
  }

  async installNormalTemplate() {
    // 拷贝模板代码至当前目录
    const spinner = spinnerStart('正在安装模板...');
    await sleep();
    try {
      const templatePath = path.resolve(this.templateNpm.cacheFilePath, 'template');
      const targetPath = process.cwd();
      fse.ensureDirSync(templatePath);
      fse.ensureDirSync(targetPath);
      fse.copySync(templatePath, targetPath);
    } catch (e) {
      throw(e);
    } finally {
      spinner.stop(true);
      log.success('模板安装成功');
    }
    const templateIgnore = this.templateInfo.ignore || [];
    const ignore = ['**/node_modules/**', ...templateIgnore];
    await this.ejsRender({ignore});
    const { installCommand, startCommand } = this.templateInfo;
    // 依赖安装
    await this.execCommand(installCommand, '依赖安装失败！');
    // 启动命令执行
    await this.execCommand(startCommand, '启动项目失败！！');
  }
  async installCustomTemplate() {
    // 查询自定义模板的入口文件
    if (await this.templateNpm.exists()) {
      const rootFile = this.templateNpm.getRootFilePath();
      if (fs.existsSync(rootFile)) {
        log.notice('开始执行自定义模板');
        const templatePath = path.resolve(this.templateNpm.cacheFilePath, 'template');
        const options = {
          templateInfo: this.templateInfo,
          projectInfo: this.projectInfo,
          sourcePath: templatePath,
          targetPath: process.cwd()
        }
        const code = `require('${rootFile}')(${JSON.stringify(options)})`;
        log.verbose('code', code);
        await execAsync('node', ['-e', code], { stdio: 'inherit', cwd: process.cwd() });
        log.success('自定义模板安装成功');
      } else {
        throw new Error('自定义模板入口文件不存在！');
      }
    }
  }

  /**
   * 1.通过项目模板API获取项目模板信息
   *  1.1 通过egg.js搭建一套后端系统
   *  1.2 通过npm存储项目模板(vue-cli/vue-element-admin)
   *  1.3 将项目模板信息存在在mongodb数据库中
   *  1.4 通过egg.js获取mongodb中的数据并且通过API返回
   */
  async downloadTemplate() {
    const { projectTemplate } = this.projectInfo;
    const templateInfo = this.template.find(item => item.npmName === projectTemplate);
    const targetPath = path.resolve(userHome, '.earth-cli', 'template');
    const storeDir = path.resolve(userHome, '.earth-cli', 'template', 'node_modules');
    const { npmName, version } = templateInfo;
    this.templateInfo = templateInfo;

    const templateNpm = new Package({
      targetPath,
      storeDir,
      packageName: npmName,
      packageVersion: version
    });

    this.templateNpm = templateNpm;

    if (!await templateNpm.exists()) {
      const spinner = spinnerStart('正在下载模板...');
      await sleep(); // 等待1s 为了看清加载loading过程
      try {
        await templateNpm.install();
      } catch(e) {
        throw e;
      } finally {
        spinner.stop(true);
        if (await templateNpm.exists()) {
          log.success('下载模板成功');
        }
      }
    } else {
      const spinner = spinnerStart('正在更新模板...');
      await sleep();
      try {
        await templateNpm.update();
      } catch(e) {
        throw e;
      } finally {
        spinner.stop(true);
        if (await templateNpm.exists()) {
          log.success('更新模板成功');
        }
      }
    }
  }

  async prepare() {
    // 0判断项目模板是否存在
    // 1、判断当前目录是否为空
    const template = await getProjectTemplate();
    if (!template || template.length === 0) {
      throw new Error('项目模板不存在!');
    }
    this.template = template;
    const localPath = process.cwd();
    let ifContinue = false;
    if (!this.isDirEmpty(localPath)) {
      // 1.1 询问是否继续创建
      if (!this.force) {
        const result = await inquirer.prompt({
          type: 'confirm',
          name: 'ifContinue',
          default: false,
          message: '当前文件夹不为空，是否继续创建项目？'
        });
        ifContinue = result.ifContinue;

        if (!ifContinue) {
          return;
        }
      }
      // 2、是否启动强制更新
      if (ifContinue || this.force) {
        // 做二次确认
        const { confirmDelete } = await inquirer.prompt({
          type: 'confirm',
          name: 'confirmDelete',
          default: false,
          message: '是否确认清空当前目录下的文件？'
        });
        if (confirmDelete) {
          // 清空当前目录
          fse.emptyDirSync(localPath);
        }
      }
    }
    return this.getProjectInfo();
  }
  async getProjectInfo() {
    function isValidName(v) {
      return /^[a-zA-Z]+([-][a-zA-Z][a-zA-Z0-9]*|[_][a-zA-Z][a-zA-Z0-9]*|[a-zA-Z0-9])*$/.test(v);
    }
    let projectInfo = {};
    let isProjectNameValid = false;
    if (isValidName(this.projectName)) {
      isProjectNameValid = true;
      projectInfo.projectName = this.projectName;
    }

    // 1、选择创建项目或组件
    const { type } = await inquirer.prompt({
      type: 'list',
      message: '请选择初始化类型',
      name: 'type',
      default: TYPE_PROJECT,
      choices: [
        {
          name: '项目',
          value: TYPE_PROJECT
        },
        {
          name: '组件',
          value: TYPE_COMPONENT
        },
      ]
    });
    log.verbose('type', type);
    const title = type === TYPE_PROJECT ? '项目' : '组件';
    this.template = this.template.filter(template => template.tag.includes(type));
    // 2、获取项目的基本信息
    const projectNamePrompt = {
      type: 'input',
      name: 'projectName',
      message: `请输入${title}名称`,
      default: '',
      validate: function(v) {
        const done = this.async();
        setTimeout(function() {
          if (!isValidName(v)) {
            // 1.输入的首字符必须为英文字符
            // 2.尾字符必须为英文或者数字，不能为字符
            // 3.字符仅允许"-_"
            done(`请输入合法的${title}名称`);
            return;
          }
          done(null, true);
        }, 0);
      },
      filter: function(v) {
        return v;
      }
    };
    const projectPrompt = [];
    if (!isProjectNameValid) {
      projectPrompt.push(projectNamePrompt);
    }
    projectPrompt.push(
      {
        type: 'input',
        name: 'projectVersion',
        message: `请输入${title}版本号`,
        default: '',
        validate: function(v) {
          const done = this.async();
          setTimeout(function() {
            if (!semver.valid(v)) {
              done('请输入合法的版本号');
              return;
            }
            done(null, true);
          }, 0);
        },
        filter: function(v) {
          if (!!semver.valid(v)) {
            return semver.valid(v);
          }
          return v;
        }
      },
      {
        type: 'list',
        name: 'projectTemplate',
        message: `请选择${title}模板`,
        choices: this.createTemplateChoice(),
        validate: function(v) {
          const done = this.async();
          setTimeout(function() {
            if (!semver.valid(v)) {
              done('请输入合法的版本号');
              return;
            }
            done(null, true);
          }, 0);
        },
        filter: function(v) {
          if (!!semver.valid(v)) {
            return semver.valid(v);
          }
          return v;
        }
      }
    );
    if (type === TYPE_PROJECT) {
      const project = await inquirer.prompt(projectPrompt);
      projectInfo = {
        ...projectInfo,
        ...project,
        type
      };
      // 项目
    } else if (type === TYPE_COMPONENT) {
      // 组件
      const descriptionPrompt = {
        type: 'input',
        name: 'componentDescription',
        message: '请输入组件描述信息',
        default: '',
        validate: function(v) {
          const done = this.async();
          setTimeout(function() {
            if (!v) {
              done('请输入组件描述信息');
              return;
            }
            done(null, true);
          }, 0);
        }
      };
      projectPrompt.push(descriptionPrompt);
      const component = await inquirer.prompt(projectPrompt);
      projectInfo = {
        ...projectInfo,
        ...component,
        type
      };
    }
    // 生成className
    if (projectInfo.projectName) {
      projectInfo.name = projectInfo.projectName;
      projectInfo.className = require('kebab-case')(projectInfo.projectName).replace(/^-/, '');
    }
    if (projectInfo.projectVersion) {
      projectInfo.version = projectInfo.projectVersion;
    }
    if (projectInfo.componentDescription) {
      projectInfo.description = projectInfo.componentDescription;
    }
    // return 项目的基本信息（object）
    return projectInfo;
  }

  // 判断当前目录是否为空
  isDirEmpty(localPath) {
    let fileList = fs.readdirSync(localPath);
    fileList = fileList.filter(file => (
      !file.startsWith('.') && ['node_modules'].indexOf(file) < 0
    ));
    return !fileList || fileList.length <= 0;
  }

  // 选择模板数据格式化
  createTemplateChoice() {
    return this.template.map((item) => ({
      value: item.npmName,
      name: item.name
    }));
  }
}

function init(argv) {
  return new InitCommand(argv);
}

module.exports = init;
module.exports.InitCommand = InitCommand;
