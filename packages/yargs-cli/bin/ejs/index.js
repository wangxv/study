const ejs = require('ejs');
const path = require('path');

const html = '<div>123 <%= user.name %></div>';
const options = {};
const data = {
  user: {
    name: 'aaaa'
  }
};

// const template = ejs.compile(html, options);

// const compiledTemplte = template(data);

// console.log(compiledTemplte);

// // 第二种用法
// const renderTemplte = ejs.render(html, data, options);
// console.log(renderTemplte);

// // 第三种用法
// ejs.renderFile(path.resolve(__dirname, 'template.html'), data, options, function(err, str){
//   // str => 输出渲染后的 HTML 字符串
//   console.log(str);
// });

// 标签
const data4 = {
  user: {
    name: 'aaaa',
    sex: '男',
    footerValue: 'footer'
  }
};
ejs.renderFile(path.resolve(__dirname, 'index.html'), data4, options, function(err, str){
  // str => 输出渲染后的 HTML 字符串
  console.log(str);
});