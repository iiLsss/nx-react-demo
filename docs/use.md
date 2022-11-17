# Nx - Monorepos

node v16.18.0
npm 8.19.2

## 创建工作区

执行命令`npx create-nx-workspace@latest`后，并在出现提示时提供以下响应：

```bash
npx create-nx-workspace@latest
  Need to install the following packages:
    create-nx-workspace@15.1.0
  Ok to proceed? (y)

 >  NX   Let's create a new workspace [https://nx.dev/getting-started/intro]

✔ Choose your style                     · integrated  // 选择风格 
✔ What to create in the new workspace   · react       // 
✔ Repository name                       · myorg       // 项目名
✔ Application name                      · store       // 应用程序名
✔ Default stylesheet format             · less        // css风格
✔ Enable distributed caching to make your CI faster · No

 >  NX   Nx is creating your v15.1.0 workspace.
```

```
├── apps                    // 应用程序
│   ├── store
│   └── store-e2e
├── libs                    // 包
├── nx.json
├── tools
│   ├── generators
│   └── tsconfig.tools.json
├── package-lock.json
├── package.json
├── babel.config.json
├── jest.config.ts
├── jest.preset.js
└── tsconfig.base.json
```

## 增加应用程序到工作区


执行命令`npx nx g @nrwl/react:app [project-name]`添加应用程序

```bash
npx nx g @nrwl/react:app admin 

 NX  Generating @nrwl/react:application

✔ Would you like to add React Router to this application? (y/N) · true
CREATE apps/admin/.babelrc
CREATE apps/admin/.browserslistrc
CREATE apps/admin/src/app/app.spec.tsx
CREATE apps/admin/src/app/nx-welcome.tsx
CREATE apps/admin/src/assets/.gitkeep
CREATE apps/admin/src/environments/environment.prod.ts
CREATE apps/admin/src/environments/environment.ts
CREATE apps/admin/src/favicon.ico
CREATE apps/admin/src/index.html
CREATE apps/admin/src/main.tsx
CREATE apps/admin/src/polyfills.ts
CREATE apps/admin/tsconfig.app.json
CREATE apps/admin/tsconfig.json
CREATE apps/admin/src/app/app.module.less
CREATE apps/admin/src/app/app.tsx
CREATE apps/admin/src/styles.less
CREATE apps/admin/project.json
CREATE apps/admin/.eslintrc.json
CREATE apps/admin-e2e/cypress.config.ts
CREATE apps/admin-e2e/src/e2e/app.cy.ts
CREATE apps/admin-e2e/src/fixtures/example.json
CREATE apps/admin-e2e/src/support/app.po.ts
CREATE apps/admin-e2e/src/support/commands.ts
CREATE apps/admin-e2e/src/support/e2e.ts
CREATE apps/admin-e2e/tsconfig.json
CREATE apps/admin-e2e/project.json
CREATE apps/admin-e2e/.eslintrc.json
CREATE apps/admin/jest.config.ts
CREATE apps/admin/tsconfig.spec.json
UPDATE package.json
```

```
├── apps                    // 项目
│   ├── admin
│   ├── admin-e2e
│   ├── store
│   └── store-e2e
....
```

## 创建包

要创建通用用户界面和产品库，请分别使用 `@nrwl/react:lib` 和 `@nrwl/js:lib` 插件


### 创建UI库

```bash
ζ npx nx g @nrwl/react:lib common-ui                            

>  NX  Generating @nrwl/react:library

CREATE libs/common-ui/project.json
CREATE libs/common-ui/.eslintrc.json
CREATE libs/common-ui/.babelrc
CREATE libs/common-ui/README.md
CREATE libs/common-ui/src/index.ts
CREATE libs/common-ui/tsconfig.json
CREATE libs/common-ui/tsconfig.lib.json
UPDATE tsconfig.base.json
CREATE libs/common-ui/jest.config.ts
CREATE libs/common-ui/tsconfig.spec.json
CREATE libs/common-ui/src/lib/common-ui.module.less
CREATE libs/common-ui/src/lib/common-ui.spec.tsx
CREATE libs/common-ui/src/lib/common-ui.tsx
```
### 创建JS库

```
npx nx g @nrwl/js:lib products 

>  NX  Generating @nrwl/js:library

CREATE libs/products/README.md
CREATE libs/products/package.json
CREATE libs/products/src/index.ts
CREATE libs/products/src/lib/products.spec.ts
CREATE libs/products/src/lib/products.ts
CREATE libs/products/tsconfig.json
CREATE libs/products/tsconfig.lib.json
CREATE libs/products/.babelrc
CREATE libs/products/project.json
UPDATE tsconfig.base.json
CREATE libs/products/.eslintrc.json
CREATE libs/products/jest.config.ts
CREATE libs/products/tsconfig.spec.json
```

### 创建全局样式库

安装依赖`npm install antd`

新建目录`shared/styles`及文件

```
└── styles
    ├── src
    │   ├── antd.less
    │   └── theme-file.less
    ├── index.less
    └── project.json    
```

**project.json**

```json
{
  "$schema": "../../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "libs/shared/styles/src",
  "projectType": "library",
  "generators": {},
  "targets": {},
  "tags": ["scope:shared", "type:styles"]
}
```

**src/theme-file.less**

```less
// 覆盖主题色
@primary-color: #7546c9; // 全局主色
@link-color: #7546c9; // 链接色
@success-color: #98a98f; // 成功色
@warning-color: #faad14; // 警告色
@error-color: #f5222d; // 错误色
@font-size-base: 14px; // 主字号
@heading-color: rgba(0, 0, 0, 0.85); // 标题色
@text-color: rgba(0, 0, 0, 0.65); // 主文本色
@text-color-secondary: rgba(0, 0, 0, 0.45); // 次文本色
@disabled-color: rgba(0, 0, 0, 0.25); // 失效色
@border-radius-base: 2px; // 组件/浮层圆角
@border-color-base: #d9d9d9; // 边框色
@box-shadow-base: 0 3px 6px -4px rgba(0, 0, 0, 0.12),
  0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05); // 浮层阴影
```

**src/antd.less**
```less
@import '~antd/es/style/themes/default.less';
@import '~antd/dist/antd.less';
@import './theme-file.less';
```

**index.less**

```less
@import './src/antd.less';
* {
  margin: 0;
  padding: 0;
}
```


**项目引入**

**apps/store/project.json**

```json
{
  "build": {
    "options": {
        "styles": [
          "libs/shared/styles/index.less",
          "apps/store/src/styles.less"
        ],
    }
  }
}
```

### 增加全局组件Button

**libs/common-ui**

```bash
npx nx g @nrwl/react:component button --project=common-ui --export 
>  NX  Generating @nrwl/react:component

CREATE libs/common-ui/src/lib/button/button.module.less
CREATE libs/common-ui/src/lib/button/button.spec.tsx
CREATE libs/common-ui/src/lib/button/button.tsx
UPDATE libs/common-ui/src/index.ts
```

**apps/libs/common-ui/src/lib/button/button.tsx**
```tsx
import { Button as AButton, ButtonProps as AButtonProps } from 'antd'
export type ButtonProps = AButtonProps

export const Button = (props: ButtonProps) => {
  return <AButton {...props}></AButton>
}

export default Button
```

**apps/admin/src/app/app.tsx**
```tsx
import { Banner } from '@myorg/common-ui';

export function App() {
  return (
    <>
      <Button type="primary">按钮</Button>
    </>
  );
}
export default App;
```

启动本地开发服务，打开页面可以见到’按钮‘
```bash
npm start
```

> monorepo 雏形初见，基于antd二次封装。多个应用共同使用

## 项目配置

项目目录
```
.
├── README.md
├── apps
│   ├── admin
│   ├── admin-e2e
│   ├── store
│   └── store-e2e
├── libs
│   ├── common-ui
│   ├── products
│   └── shared
├── tools
│   ├── generators
│   └── tsconfig.tools.json
├── babel.config.json
├── jest.config.ts
├── jest.preset.js
├── nx.json
├── package-lock.json
├── package.json
└── tsconfig.base.json
```

