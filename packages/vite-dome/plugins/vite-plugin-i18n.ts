export default {
  name: 'vite-plugin-i18n',
  // 将load进来的代码块进一步加工处理
  /**
   * 
   * @param code 块的内容
   * @param id 请求的url
   * @returns 
   */
  transform(code, id) {
    // i18n信息写入
    if (/vue&type=i18n/.test(id)) {
      return `export default Comp => {
        Comp.i18n = ${code}
      }`
    }
    return null;
  }
}