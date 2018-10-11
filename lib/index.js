'use strict';

const assert = require('assert');
const ACM = require('./ACM');

module.exports = app => {
  app.addSingleton('acm', createOneClient);
};

function createOneClient(config, app) {
  assert(config.namespace && config.accessKey && config.secretKey);
  const client = new ACM(config);
  app.beforeStart(async function() {
    await client.getConfigs();
    app.coreLogger.info(`[egg-acm] ${config.namespace}@${config.endpoint} connected`);
  });
  return client;
}
