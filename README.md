# nx react erpo

## 搭建

#### 1. 创建应用（基于react）

```bash
npx nx g @nrwl/react:app my-app
✔ Would you like to add React Router to this application? (y/N) · true

```

**新增目录my-app**
```
└── apps
    ├── my-app
    └── my-app-e2e
```

#### 2. 添加库lib

```
npx nx g @nrwl/react:lib common-ui
```

```
└── libs
    └──common-ui
```

#### 3. 创建 style 库

```
└── styles
    ├── index.less
    ├── project.json
    └── src
        └── antd.less
```

**项目中进行引用**

**apps/store/src/project.json**

```json
{
  "targets": {
    "build": {
      "styles": ["libs/shared/styles/index.less", "apps/store/src/styles.less"]
    }
  }
}
```

#### 4

