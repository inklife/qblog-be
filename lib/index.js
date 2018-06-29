'use strict';

const ACMClient = require('acm-client');
const co = require('co');
const propertiesParser = require('properties-parser');
/**
 * @param {object} config ACM 连接参数配置
 * @param {object} app egg.js的app对象
 * @return {object} 返回 ACM 实例
 */
module.exports = (config, app) => {
  const __acm__ = {};
  const __SUBSCRIBERS__ = Symbol('ACM_SUBSCRIBERS');
  const subscribeMap = __acm__[__SUBSCRIBERS__] = new Map();
  /**
   * 添加 ACM 变动监听器
   * @param {string} name 您可以为同一 dataId 的实例添加多个监听器，并以 name 区分它们。
   * @param {function} subscriber 监听器的回调函数
   */
  __acm__.addChangeListener = function(name, subscriber) {
    if (typeof subscriber !== 'function') {
      return;
    }
    subscribeMap.set(name, subscriber);
  };
  /**
   * 移除相应监听器
   * @param {string} name 监听器的名字
   */
  __acm__.removeChangeListener = function(name) {
    subscribeMap.delete(name);
  };

  const client = getClient(config);
  init(config, app, client, __acm__);
  subscribe(config, app, client, __acm__, subscribeMap);

  client.on('error', err => {
    app.coreLogger.warn(err);
  });

  return __acm__;
};
/**
 * 返回一个ACM的连接实例
 * @param {object} config ACM 连接参数配置
 * @return {APIClient} 返回一个ACM API的连接实例
 */
function getClient({ endpoint, namespace, accessKey, secretKey, requestTimeout }) {
  return new ACMClient({
    endpoint,
    namespace,
    accessKey,
    secretKey,
    requestTimeout,
  });
}
/**
 * ACM 数据初始化
 * @param {object} config ACM 连接参数配置
 * @param {object} app egg.js的app对象
 * @param {APIClient} client ACM API的连接实例
 * @param {object} data ACM 上挂载的数据
 * @return {promise} client 的连接承诺
 */
function init(config, app, client, data) {
  return co(function* () {
    const __raw = yield client.getConfig(config.dataId, config.group);
    data[config.dataId] = {};
    data[config.dataId].__raw = __raw;
    Object.assign(data[config.dataId], parse(__raw));
    app.coreLogger.info('[egg-acm] init instance success.');
  });
}
/**
 * 订阅 ACM 数据变化 并触发用户添加的监听器
 * @param {object} config ACM 连接参数配置
 * @param {object} _ egg.js的app对象
 * @param {APIClient} client ACM API的连接实例
 * @param {object} __acm__ ACM 实例
 * @param {map<string, function>} subscribeMap 回调函数键值对
 */
function subscribe(config, _, client, __acm__, subscribeMap) {
  client.subscribe({
    dataId: config.dataId,
    group: config.group,
  }, __raw => {
    const oldData = __acm__[config.dataId];
    // 更新
    __acm__[config.dataId] = {};
    __acm__[config.dataId].__raw = __raw;
    Object.assign(__acm__[config.dataId], parse(__raw));
    subscribeMap.forEach(fn => {
      if (typeof fn === 'function') {
        fn(__acm__[config.dataId], oldData);
      }
    });
  });
}
/**
 * 文本解析为 Obejct
 * @param {string} text 待解析的文本
 * @return {objetc} 解析后的对象
 */
function parse(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch (error) {
    if (isProperties(text)) {
      data = propertiesParser.parse(text);
    } else {
      data = {};
    }
  }
  return data;
}
/**
 * 判定文本是否需要 propertiesParser 解析
 * @param {string} text 待判定的文本
 * @return {boolean} 返回判定的结果
 */
function isProperties(text) {
  text = text.trimLeft();
  const l = text.length;
  for (let i = 0; i < l; i++) {
    const c = text.charAt(i);
    if (c === '\r' || c === '\n') {
      return false;
    }
    if (c === '=') {
      return true;
    }
  }
  return false;
}
