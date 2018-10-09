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
      accessKey: '${accessKey}', // check it at aliyun key
      secretKey: '${secretKey}', // check it at aliyun key
      dataId: '${dataId}',
      group: 'DEFAULT_GROUP', // If it is the default, it can be omitted.
    },
    // Is it mounted to app. Default opening.
    app: true,
    // Is it mounted to agent. Keep closed.
    agent: false,
  };

  return config;
};
```

## When to use

- Use [Aliyun ACM](https://acm.console.aliyun.com) to automate **Application Configuration**.

### Instructions

This plugin mounts your ACM data to `app.acm.${dataId}`, and two data formats(`JSON` and `Properties`) are automatically parsed. For unsupported data formats(like `XML` etc), you can still get source text through `app.acm.${dataId}.__raw`.

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
    dataId: 'test',
    group: 'DEFAULT_GROUP',
  },
};
```

Then you could get your ACM data by `app.acm.test` (Note that in this case, Data ID is `test`).

A very simple example is as follows.

```js
// {app_root}/app/controller/home.js
'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    // "hi, 123".
    this.ctx.body = 'hi, ' + this.app.acm.test.magical;
  }
}

module.exports = HomeController;
```

Open the browser and you will get "hi, 123". Modify your ACM data in the console of Aliyun, for instance, giving **"magical"** a new value. Refresh your browser. What will happen? No mistake, it's automatic.

**Reserved Key Name**

It is not recommended to use the following name as `${dataId}` name.

* addChangeListener

You can add change monitoring in your egg.js application, and you will be notified when the Aliyun ACM configuration changes.

Example:
``` javascript
// somewhere you may get egg.js app instance, like controller, service …
app.acm.addChangeListener('A meanful name, like "notice"', function(newData, oldData) {
  noticeSomeApi(newData);
});
```

* removeChangeListener

Remove `${name_description}` monitor.

* $data

* $init

## Example

[acm-sdk-egg-demo](https://github.com/shuang6/acm-sdk-egg-demo)

## Todolist

- Multi configuration optimization
- Code style optimization
- Important updates

## Questions & Suggestions

Please open an issue [here](https://github.com/shuang6/egg-acm/issues).

## License

[MIT](LICENSE)
