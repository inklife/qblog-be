'use strict';

const Acm = require('./lib');

// egg-acm/app.js
module.exports = app => {
  if (app.config.acm.app) Acm(app);
};
