# 常见问题

## 自定义webpack配置

```js
// apps/[project-name]/project.json
{ 
  "targets": {
    "build": {
      "executor": "@nrwl/webpack:webpack",
      // ...
      "options": {
        // ...
        "webpackConfig": "apps/[project-name]/custom-webpack.config.js"
      },
    }
  }
}

```

```js
// apps/[project-name]/custom-webpack.config.js
const { merge } = require('webpack-merge')

module.exports = (config, context) => {
  const mergeConfig = merge(config, {
    devServer: {
      proxy: {
        '/api': {
          target: 'https://mock.api.com',
          changeOrigin: true,
          pathRewrite: {
            '/api': '/',
          },
        }
      },
    },
  })
  console.log(mergeConfig)
  return mergeConfig
}
```

## 公共库静态资源图片如何引入打包

```bash
npx nx g @nrwl/js:lib shared/imagess

CREATE libs/shared/imagess/README.md
CREATE libs/shared/imagess/package.json
CREATE libs/shared/imagess/src/index.ts
CREATE libs/shared/imagess/src/lib/shared-imagess.spec.ts
CREATE libs/shared/imagess/src/lib/shared-imagess.ts
CREATE libs/shared/imagess/tsconfig.json
CREATE libs/shared/imagess/tsconfig.lib.json
CREATE libs/shared/imagess/.babelrc
CREATE libs/shared/imagess/project.json
UPDATE tsconfig.base.json
CREATE libs/shared/imagess/.eslintrc.json
CREATE libs/shared/imagess/jest.config.ts
CREATE libs/shared/imagess/tsconfig.spec.json
```

将`src`目录下文件清空，放入图片文件

```
shared
  ├──imagess
    ├── README.md
    ├── jest.config.ts
    ├── project.json
    ├── src
    │   ├── data-monitoring.png
    │   ├── mail-letter.svg
    │   ├── play-video.png
    │   └── ystem-warning.svg
    ├── tsconfig.json
    ├── tsconfig.lib.json
    └── tsconfig.spec.json
```

组件引用

```jsx
// apps/store/src/pages/Home/index.tsx
<img width="200" src="./assets/play-video.png" alt="" />
```

配置静态资源

```json
// apps/store/project.json
{
  "targets": {
    "assets": [
      // ...
      {
        "glob": "**/*",
        "input": "libs/shared/imagess/src", // 引入路径
        "output": "assets" // 输出目录
      }
    ],
  }
}
```



## 自定义环境变量模式

https://nx.dev/recipes/environment-variables/define-environment-variables

`apps/store/project.json`配置文件的`target`字段新增命令`env-dev`、`env-test`、`env-prod`

**apps/store/project.json**
```json
{
  "targets": {
    "env-dev": {
      "executor": "nx:run-commands",
      "options": {
        "commands": [
          "nx serve"
        ],
        "envFile": "apps/store/.env.dev",
        "parallel": false
      }
    },
    "env-test": {
      "executor": "nx:run-commands",
      "options": {
        "commands": [
          "nx build"
        ],
        "envFile": "apps/store/.env.test",
        "parallel": false
      }
    },
    "env-prod": {
      "executor": "nx:run-commands",
      "options": {
        "commands": [
          "nx build"
        ],
        "envFile": "apps/store/.env.prod",
        "parallel": false
      }
    },
  }
}

```

`apps/store`目录下新增环境配置文件`.env.dev`、`.env.test`、`.env.prod`

```
├── apps
|   ├── store               
|       ├── .env.dev 
|       ├── .env.test 
|       ├── .env.prod
| .... 
```

根目录`package.json`修改启动打包命令
```json
{
  "script": {
    "start": "nx run store:env-dev",
    "build:store": "nx run store:env-test",
  }
}
```

<!-- ## -->

