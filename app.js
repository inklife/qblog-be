'use strict';

const Acm = require('./lib');

// egg-acm/app.js
module.exports = app => {
<<<<<<< HEAD
  if (app.config.acm.app) Acm(app);
=======
  const config = app.config.acm;
  assert(config.namespace && config.accessKey && config.secretKey && config.dataId && config.group);
  const acm = Acm(config, app);
  app.acm = acm;
>>>>>>> 5e31f28d58c29da8c9ad04ff22f95ee451d5f1e3
};
