module.exports = {
  sum(a, b) {
    return a + b;
  },
  mul(a, b) {
    return a * b;
  },
  init(option, param) {
    console.log('执行init');
    console.log('参数：', option, param);
  }
}