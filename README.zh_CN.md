# egg-acm

<!--
Description here.
-->

## 依赖说明

### 依赖的 egg 版本

egg-acm 版本 | egg 1.x
--- | ---
1.x | 😁
0.x | ❌

<!--

如果有依赖其它插件，请在这里特别说明。如

- security
- multipart

-->

## 安装

```bash
$ npm i egg-acm --save
```

## 开启插件

您可能需要先获取[阿里云Key](https://ram.console.aliyun.com)

```js
// config/plugin.js
exports.acm = {
  enable: true,
  package: 'egg-acm',
};
// config/config.${EGG_SERVER_ENV}.js
module.exports = appInfo => {
  const config = exports = {};
  // 数据库配置
  config.acm = {
    // 单数据库信息配置
    client: {
      endpoint: 'acm.aliyun.com', // acm 控制台查看
      namespace: '${namespace}', // acm 控制台查看
      accessKey: '${accessKey}', // 阿里云Key 查看
      secretKey: '${secretKey}', // 阿里云Key 查看
      dataId: '${dataId}',
      group: 'DEFAULT_GROUP',
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，关闭
    agent: false,
  };

  return config;
};
```

## 使用场景

- 根据[阿里云ACM](https://acm.console.aliyun.com)`自动化`**应用配置**

### 说明

此插件将您的阿里云ACM应用配置挂载到`app.acm.${dataId}`对象上，并对`JSON`和`Properties`两种数据格式做了自动解析，对于不支持自动解析挂载的数据格式（如`XML`等），您依然可以通过`app.acm.${dataId}.__raw`获取源文本。

**acm保留键值**

您不能使用以下名称作为您的`${dataId}`：

* addChangeListener

您可以在您的egg.js应用中添加变动监听，当阿里云ACM配置变动时，您可以获得通知。

例：
``` javascript
// somewhere you may get app instance, like controller, service …
app.acm.addChangeListener('A meanful name, like "notice"', function(newData, oldData) {
  noticeSomeApi(newData);
});
```

* removeChangeListener

移除`${name_description}`的监听。

* $data

## 详细配置

请到 [config/config.default.js](config/config.default.js) 查看详细配置项说明。

## Example

[egg-acm-example](https://github.com/shuang6/egg-acm-example)

## 提问交流

请到 [egg-acm issues](https://github.com/shuang6/egg-acm/issues) 交流。

## License

[MIT](LICENSE)
