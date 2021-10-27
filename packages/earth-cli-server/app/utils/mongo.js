'use strict';

const Mongodb = require('@pick-star/cli-mongodb');
const { mongodbUrl, mongodbDbName } = require('../../config/db');

function mongo() {
  console.log('mongodb:', Mongodb);
  return new Mongodb(mongodbUrl, mongodbDbName);
}

module.exports = mongo;
