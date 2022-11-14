# nx react erpo

1. 创建应用

```bash
nx g @nrwl/react:app my-app
```

2. 添加库

```
nx g @nrwl/react:lib my-lib
```

3. 创建 style 库

```
└── styles
    ├── index.less
    ├── project.json
    └── src
        └── antd.less
```

4. 项目中进行引用

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
