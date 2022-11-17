# Project Configuration 项目配置

项目可以使用`package.json`进行配置(如果你使用npm脚本而不是nx执行器)。`package.json`和`project.json`文件都位于每个项目的文件夹中。Nx会合并两个文件的配置

## 定义环境变量

https://nx.dev/recipes/environment-variables/define-environment-variables

环境变量是操作系统 (OS) 下运行的所有进程都可以访问的全局系统变量。 环境变量可用于存储系统范围的值，例如用于搜索可执行程序的目录 (PATH)、操作系统版本、网络信息和自定义变量。 这些环境变量在构建时传递并在应用程序运行时使用。

### 设置环境变量

默认情况下，Nx 将加载您放置在以下文件中的任何环境变量：

1. `apps/my-app/.[target-name].env`
2. `apps/my-app/.env.[target-name]`
3. `apps/my-app/.local.env`
4. `apps/my-app/.env.local`
5. `apps/my-app/.env`
6. `.[target-name].env`
7. `.env.[target-name]`
8. `.local.env`
9. `.env.local`
10. `.env`


```
顺序很重要

Nx 将遍历上面的列表，忽略它找不到的文件，并将环境变量加载到它可以找到的当前进程中。 如果它发现一个已经加载到进程中的变量，它将忽略它。 它这样做有两个原因

1. 开发人员不能意外覆盖重要的系统级变量（如 NODE_ENV）
2. 允许开发人员为其本地环境创建 .env.local 或 .local.env 文件并覆盖 .env 中设置的任何项目默认值
3. 允许开发人员创建目标特定的 .env.[target-name] 或 .[target-name].env 以覆盖特定目标的环境变量。 例如，您可以通过在 .build.env 中设置 NODE_OPTIONS=--max-old-space-size=4096 来增加仅用于构建目标的节点进程的内存使用

例如：
1. apps/my-app/.env.local 包含 NX_API_URL=http://localhost:3333
2. apps/my-app/.env 包含 NX_API_URL=https://api.example.com
3. Nx 将首先将变量从 apps/my-app/.env.local 加载到进程中。 当它尝试从apps/my-app/.env 加载变量时，它会注意到NX_API_URL 已经存在，所以它会忽略它。

我们建议将您的应用特定的 env 文件嵌套在 apps/your-app 中，并为特定于工作空间的设置（如 Nx Cloud 令牌）创建工作空间/根级别 env 文件。
```

### 指向自定义环境文件

如果要从 env 文件中加载变量，而不是上面列出的变量：

1. 使用 [env-cmd](https://www.npmjs.com/package/env-cmd) 包： env-cmd -f .qa.env nx serve
2. 使用 [run-commands](https://nx.dev/packages/nx/executors/run-commands#envfile) 构建器的 envFile 选项并在构建器内执行您的命令


#### 采用方案2

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