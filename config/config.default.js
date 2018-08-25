'use strict';

/**
 * egg-acm default config
 * @member Config#acm
 * @property {String} SOME_KEY - some description
 */
exports.acm = {
  default: {
    endpoint: 'acm.aliyun.com',
    namespace: '',
    accessKey: '',
    secretKey: '',
    requestTimeout: 6000,
    dataId: '',
    group: 'DEFAULT_GROUP',
  },
  app: true,
  agent: false,
};
