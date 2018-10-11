# Upgrade to 2.0

- The original ACM-client API was retained.
- Remove unfriendly and aggressive API expansion.

You might need to browse the official packages first.

- [egg-acm](https://github.com/eggjs/egg-acm)
- [acm-sdk-nodejs](https://github.com/acm-group/acm-sdk-nodejs)

# egg-acm

An [egg.js](https://eggjs.org) plugin for `AlibabaCloud` [ACM](https://acm.console.aliyun.com)(short for Application Configuration Management).

AlibabaCloud ACM [Learning path](https://help.aliyun.com/learn/learningpath/acm.html?spm=5176.acm.ConfigurationManagement.4.2bc54a9bL1YT6m).

## Install

```bash
$ npm i egg-acm --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.acm = {
  enable: true,
  package: 'egg-acm',
};
```

## Configuration

You might need to get [Aliyun Secret Key](https://ram.console.aliyun.com) first.

```js
// {app_root}/config/config.${EGG_SERVER_ENV}.js
module.exports = appInfo => {
  const config = exports = {};
  config.acm = {
    // config of single client
    client: {
      endpoint: 'acm.aliyun.com', // check it at acm console
      namespace: '${namespace}', // check it at acm console
      accessKey: '${accessKey}', // check it at acm console
      secretKey: '${secretKey}', // check it at acm console
      requestTimeout: 6000,
    },
    app: true,
    agent: false,
  };

  return config;
};
```

### Instructions

You could access the ACM-client instance via `app.acm`.

Reading [ACM-client document](https://github.com/acm-group/acm-sdk-nodejs) in the first place will be helpful. This package retains its original API.

Compared with the original API, this package does some expansion.

#### Get configuration

- `async function getConfig(dataId, group, format)`

The `format` could be `JSON` and `Properties`, this function will return parsed javascript object. If the format is not supported or left blank, it will return to plain text like the original API.

Example:

Suppose your configuration in the background of Aliyun is like this.

- Data ID: `test`
- Group: `DEFAULT_GROUP`
- Configuration Format: `JSON`
- Configuration content

```json
{
    "magical": 123,
    "hi": [ "0", "world" ]
}
```

Now you may modify your Egg.js App config file like this.

```js
// {app_root}/config/config.default.js
config.acm = {
  // single client
  client: {
    endpoint: 'acm.aliyun.com', // check it at acm console
    namespace: '${namespace}', // check it at acm console
    accessKey: '${accessKey}', // check it at aliyun key
    secretKey: '${secretKey}', // check it at aliyun key
  },
};
```

A very simple example is as follows.

```js
// {app_root}/app/controller/home.js
'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    // "hi, 123".
    const { magical } = await this.app.acm.getConfig('test', 'DEFAULT_GROUP', 'json');
    this.ctx.body = 'hi, ' + magical;
  }
}

module.exports = HomeController;
```

## Example

[acm-sdk-egg-demo](https://github.com/shuang6/acm-sdk-egg-demo)

## Todolist

- Data cache
- Code style optimization

## Questions & Suggestions

Please open an issue [here](https://github.com/shuang6/egg-acm/issues).

## License

[MIT](LICENSE)
