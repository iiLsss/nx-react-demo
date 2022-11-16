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
✔ Application name                      · admin       // 应用程序名
✔ Default stylesheet format             · less        // css风格
✔ Enable distributed caching to make your CI faster · No

 >  NX   Nx is creating your v15.1.0 workspace.
```

```
├── apps                    // 应用程序
│   ├── admin
│   └── admin-e2e
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
npx nx g @nrwl/react:app diqiu 

 NX  Generating @nrwl/react:application

✔ Would you like to add React Router to this application? (y/N) · true
CREATE apps/diqiu/.babelrc
CREATE apps/diqiu/.browserslistrc
CREATE apps/diqiu/src/app/app.spec.tsx
CREATE apps/diqiu/src/app/nx-welcome.tsx
CREATE apps/diqiu/src/assets/.gitkeep
CREATE apps/diqiu/src/environments/environment.prod.ts
CREATE apps/diqiu/src/environments/environment.ts
CREATE apps/diqiu/src/favicon.ico
CREATE apps/diqiu/src/index.html
CREATE apps/diqiu/src/main.tsx
CREATE apps/diqiu/src/polyfills.ts
CREATE apps/diqiu/tsconfig.app.json
CREATE apps/diqiu/tsconfig.json
CREATE apps/diqiu/src/app/app.module.less
CREATE apps/diqiu/src/app/app.tsx
CREATE apps/diqiu/src/styles.less
CREATE apps/diqiu/project.json
CREATE apps/diqiu/.eslintrc.json
CREATE apps/diqiu-e2e/cypress.config.ts
CREATE apps/diqiu-e2e/src/e2e/app.cy.ts
CREATE apps/diqiu-e2e/src/fixtures/example.json
CREATE apps/diqiu-e2e/src/support/app.po.ts
CREATE apps/diqiu-e2e/src/support/commands.ts
CREATE apps/diqiu-e2e/src/support/e2e.ts
CREATE apps/diqiu-e2e/tsconfig.json
CREATE apps/diqiu-e2e/project.json
CREATE apps/diqiu-e2e/.eslintrc.json
CREATE apps/diqiu/jest.config.ts
CREATE apps/diqiu/tsconfig.spec.json
UPDATE package.json
```

```
├── apps                    // 应用程序
│   ├── admin
│   ├── admin-e2e
│   ├── diqiu
│   └── admin-e2e
....
```

## 创建包

要创建通用用户界面和产品库，请分别使用 `@nrwl/react:lib` 和 `@nrwl/js:lib` 插件


创建UI库

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

创建JS库

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

## 