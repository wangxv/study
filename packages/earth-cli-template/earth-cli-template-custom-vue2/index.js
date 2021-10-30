const fse = require('fs-extra');
const inquirer = require('inquirer');
const ejs = require('ejs');
const glob = require('glob');

async function ejsRender(options) {
  const dir = options.targetPath;
  const projectInfo = options.data;
  return new Promise((resolve, reject) => {
    glob('**', {
      cwd: dir,
      ignore: options.ignore || '',
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

async function install(options) {
  const projectPrompt = [];
  const descriptionPrompt = {
    type: 'input',
    name: 'description',
    message: '请输入项目描述信息',
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
  const projectResult = await inquirer.prompt(projectPrompt);
  options.projectInfo.description = projectResult.description;
  try {
    const { sourcePath, targetPath, templateInfo, projectInfo } = options;
    fse.ensureDirSync(sourcePath);
    fse.ensureDirSync(targetPath);
    fse.copySync(sourcePath, targetPath);
    const templateIgnore = templateInfo.ignore || [];
    const ignore = ['**/node_modules/**', ...templateIgnore];
    await ejsRender({ ignore, targetPath, data: projectInfo });
    // const { installCommand, startCommand } = this.templateInfo;
    // // 依赖安装
    // await this.execCommand(installCommand, '依赖安装失败！');
    // // 启动命令执行
    // await this.execCommand(startCommand, '启动项目失败！！');
  } catch (e) {
    throw(e);
  }
}

module.exports = install;
