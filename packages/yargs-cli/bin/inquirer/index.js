const inquirer = require('inquirer');

inquirer
  .prompt([
    {
      type: 'input',
      name: 'yourName',
      message: 'your name',
      default: 'noname',
      validate: function(v) { // 校验
        return typeof v === 'string';
      },
      transformer: function(v) {
        return v + '  input you name';
      },
      filter: function(v) {
        return 'name' + v;
      }
    },
    {
      type: 'number',
      name: 'num',
      message: 'your number'
    }
  ])
  .then((answers) => {
    console.log(answers);
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });
