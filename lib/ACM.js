'use strict';

const { ACMClient } = require('acm-client');
const propertiesParser = require('properties-parser');

class ACM extends ACMClient {
  constructor(options = {}) {
    // TODO: 缓存
    options.enableDataCache = false;
    super(options);
  }

  async getConfig(dataId, group, format) {
    let content;
    if (typeof format === 'string') { // 尝试解析文本
      const raw = await super.getConfig(dataId, group);
      format = format.toLowerCase();
      try {
        switch (format) {
          case 'json':
            content = JSON.parse(raw);
            break;
          case 'properties':
            content = propertiesParser.parse(raw);
            break;
          default:
            content = raw;
            break;
        }
      } catch (error) {
        content = raw;
      }
    } else if (format == null) {
      content = await super.getConfig(dataId, group);
    // 兼容 options.unit
    } else if (typeof format === 'object' && format.unit) {
      content = await super.getConfig(dataId, group, format);
    }
    return content;
  }

}

module.exports = ACM;
