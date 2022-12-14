# Nx - Monorepos

Monorepos

## 项目集成 vs 依赖包管理

[原文](https://nx.dev/concepts/integrated-vs-package-based)

您可以使用 Nx 构建两种样式的 monorepos：集成存储库和基于包的存储库。 在最基本的层面上，基于包的存储库利用了 Nx 的核心功能，而集成存储库也使用了插件功能。 但区别更多的是思维方式而不是所使用的功能，并且样式选择是在一个范围内 - 而不是布尔值。

- 依赖包管理注重灵活性和易于采用。
- 项目集成专注于效率和易于维护。


### 包管理

基于包的 repo 是一组通过 package.json 文件和嵌套的 node_modules 相互依赖的包。 通过此设置，您通常会为每个项目设置一组不同的依赖项。 像 Jest 和 Webpack 这样的构建工具像往常一样工作，因为一切都被解决了，就好像每个包都在一个单独的 repo 中一样，并且它的所有依赖项都发布到 npm。 将现有包移动到基于包的存储库中非常容易，因为您通常会保持该包的现有构建工具不变。 在存储库中创建一个新包与创建一个新存储库一样困难，因为您必须从头开始创建所有构建工具。

Lerna、Yarn、Lage 和 Nx（没有插件）支持这种风格。

### 项目集成

项目集成包含通过标准导入语句相互依赖的项目。 通常在根目录下定义的每个依赖项都有一个版本。 有时需要包装像 Jest 和 Webpack 这样的构建工具才能正常工作。 很难将现有包添加到这种类型的 repo，因为可能需要修改该包的构建工具。 将一个全新的项目添加到 repo 非常简单，因为所有的工具决策都已经做出。

Bazel 和 Nx（带插件）支持这种风格。


### 如何选择

您可以在任何一种风格的 repo 中成功工作。 通常，刚开始使用 monorepo 的组织会从基于包的 repo 开始，因为他们想要快速运行的东西，并且可以在没有大量前期成本的情况下展示 monorepo 的价值。 但是，如果一个组织接受了 monorepo 的想法，特别是一旦他们开始扩大规模，集成的 repo 就会变得更有价值。 当创建一个新项目很简单时，每条新路线或功能都可以成为自己的项目，并且跨应用程序共享代码变得简单且可维护。 集成的 repos 限制了您的一些选择，以便让 Nx 为您提供更多帮助。

package-based repos 和 integrated repos 之间的比较类似于 JSDoc 和 TypeScript 之间的比较。 前者更容易采用并提供一些好处。 后者需要更多的工作，但提供更多的价值，尤其是在更大的范围内。

[心智模型](https://nx.dev/concepts/mental-model)

