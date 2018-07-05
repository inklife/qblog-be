'use strict';

const assert = require('assert');
const Acm = require('./lib');

// egg-acm/app.js
module.exports = app => {
  const config = app.config.acm;
  assert(config.namespace && config.accessKey && config.secretKey && config.dataId && config.group);
  const acm = Acm(config, app);
  app.acm = acm;
};
