'use strict'

const Controller = require('egg').Controller;
const mongo = require('../utils/mongo');

class templateController extends Controller {
  // 获取模板类型
  async getTemplateType() {
    const { ctx } = this;
    const data = await mongo().query('templateType')
    console.log(data);
    ctx.body = data;
  }
}

module.exports = templateController;