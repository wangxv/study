'use strict';

const Controller = require('egg').Controller;
const mongo = require('../utils/mongo');

class templateController extends Controller {
  // 获取模板类型
  async getTemplateType() {
    const { ctx } = this;
    const data = await mongo().query('templateType');
    ctx.body = data;
  }
  // 添加模板
  async addTemplate() {
    const { ctx } = this;
    console.log('ctx.request.body', ctx.request.body);
    const res = await mongo().insert('template', ctx.request.body);
    console.log('res------: ', res.insertedIds[0]);
    ctx.body = { id: res.id };
    ctx.status = 200;
  }
}

module.exports = templateController;
