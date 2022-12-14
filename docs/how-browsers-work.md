# 浏览器如何工作

现代网络浏览器的幕后

## 前言

这本关于 WebKit 和 Gecko 内部操作的综合入门书是以色列开发人员 Tali Garsiel 进行大量研究的结果。 几年来，她查阅了所有已发布的关于浏览器内部结构的数据，并花费了大量时间阅读网络浏览器源代码。 她写了：

> 在 IE 90% 独霸的年代，只能把浏览器当成“黑盒子”，而现在，开源浏览器占据了[一半以上的使用份额](https://techcrunch.com/2011/08/01/open-web-browsers/)，是时候看看下面的内容了 引擎的引擎盖，看看网络浏览器里面有什么。 好吧，里面有数百万行 C++ 行……

塔莉在她的网站上发表了她的研究，但我们知道它值得更多的读者，所以我们整理了它并在此处重新发布。

> 作为 Web 开发人员，了解浏览器操作的内部结构有助于您做出更好的决策并了解开发最佳实践背后的理由。 虽然这是一份相当冗长的文档，但我们建议您花一些时间深入研究； 我们保证您会很高兴。

## 介绍

Web 浏览器是使用最广泛的软件。在这篇入门文章中，我将解释它们在幕后是如何工作的。我们将看看当您在地址栏中键入 google.com 时会发生什么，直到您在浏览器屏幕上看到 Google 页面。

## 我们将讨论的浏览器

当今桌面上使用的主要浏览器有五种：Chrome、Internet Explorer、Firefox、Safari 和 Opera。 在移动端，主要的浏览器有安卓浏览器、iPhone、Opera Mini 和 Opera Mobile、UC 浏览器、诺基亚 S40/S60 浏览器和 Chrome，除 Opera 浏览器外，其他浏览器均基于 WebKit。 我将给出开源浏览器 Firefox 和 Chrome 以及 Safari（部分开源）的示例。 根据 StatCounter 统计数据（截至 2013 年 6 月），Chrome、Firefox 和 Safari 约占全球桌面浏览器使用量的 71%。 在移动设备上，Android 浏览器、iPhone 和 Chrome 约占使用量的 54%。

## 浏览器的主要功能

浏览器的主要功能是通过向服务器请求并在浏览器窗口中显示来呈现您选择的 Web 资源。 资源通常是 HTML 文档，但也可以是 PDF、图像或其他类型的内容。 资源的位置由用户使用 URI（统一资源标识符）指定。

浏览器解释和显示 HTML 文件的方式在 HTML 和 CSS 规范中指定。 这些规范由 W3C（万维网联盟）组织维护，该组织是网络标准组织。 多年来，浏览器只遵循规范的一部分并开发了自己的扩展。 这给网络作者带来了严重的兼容性问题。 今天大多数浏览器或多或少都符合规范。

浏览器用户界面彼此之间有很多共同点。常见的用户界面元素包括：

1. 用于插入 URI 的地址栏
2. 后退和前进按钮
3. 书签选项
4. 用于刷新或停止加载当前文档的刷新和停止按钮
5. 将您带到主页的主页按钮

奇怪的是，浏览器的用户界面并没有在任何正式规范中指定，它只是来自多年经验和浏览器相互模仿形成的良好实践。 HTML5 规范没有定义浏览器必须具备的 UI 元素，但列出了一些常见元素。 其中包括地址栏、状态栏和工具栏。 当然，有特定浏览器独有的功能，例如 Firefox 的下载管理器。

## 浏览器的高层结构

浏览器的主要组件是：

1. **用户界面**：这包括地址栏、后退/前进按钮、书签菜单等。除了您看到所请求页面的窗口外，浏览器的每个部分都会显示。
2. **浏览器引擎**：在 UI 和渲染引擎之间编组操作。
3. **渲染引擎**：负责显示请求的内容。例如请求的内容是HTML，渲染引擎解析HTML和CSS，并将解析后的内容显示在屏幕上。
4. **网络**：对于 HTTP 请求等网络调用，在独立于平台的接口后面针对不同平台使用不同的实现。
5. **用户界面后端**：用于绘制组合框和窗口等基本小部件。该后端公开了一个非特定于平台的通用接口。在它下面使用操作系统用户界面方法
6. **JavaScript 解释器**：用于解析和执行 JavaScript 代码。
7. **数据存储**：这是一个持久层。浏览器可能需要在本地保存各种数据，例如 cookie。浏览器还支持存储机制，例如 localStorage、IndexedDB、WebSQL 和 FileSystem。

![图 1：浏览器组件](https://web-dev.imgix.net/image/T4FyVKpzu4WKF1kBNvXepbi08t52/PgPX6ZMyKSwF6kB8zIhB.png?auto=format&w=1000)

需要注意的是，Chrome 等浏览器运行渲染引擎的多个实例：每个选项卡一个。每个选项卡都在单独的进程中运行。

## 渲染引擎

渲染引擎的职责就是渲染，也就是将请求的内容显示在浏览器屏幕上。

默认情况下，呈现引擎可以显示 HTML 和 XML 文档和图像。 可通过插件或扩展展示其他类型的数据； 例如，使用 PDF 查看器插件显示 PDF 文档。 但是，在本章中，我们将重点关注主要用例：显示使用 CSS 格式化的 HTML 和图像。

## 渲染引擎

不同的浏览器使用不同的渲染引擎：Internet Explorer 使用 Trident，Firefox 使用 Gecko，Safari 使用 WebKit。 Chrome 和 Opera（从版本 15 开始）使用 Blink，它是 WebKit 的一个分支

WebKit 是一个开源渲染引擎，最初是作为 Linux 平台的引擎，后来被 Apple 修改以支持 Mac 和 Windows。有关详细信息，请参阅 webkit.org

### 主要流程

渲染引擎将开始从网络层获取请求文档的内容。这通常以 8kB 块的形式完成。

之后，这是渲染引擎的基本流程：

![图2：渲染引擎基本流程](https://web-dev.imgix.net/image/T4FyVKpzu4WKF1kBNvXepbi08t52/bPlYx9xODQH4X1KuUNpc.png?auto=format&w=1200)

解析 HTML 以构建 DOM 树 -> 构造渲染树 -> 布局渲染树 -> 绘制渲染树

呈现引擎将开始解析 HTML 文档并将元素转换为称为“内容树”的树中的 DOM 节点。 引擎将解析样式数据，包括外部 CSS 文件和样式元素。 HTML 中的样式信息和视觉指令将用于创建另一棵树：渲染树。

渲染树包含具有视觉属性（如颜色和尺寸）的矩形。 矩形以正确的顺序显示在屏幕上。

在构建渲染树之后，它会经历一个“布局”过程。 这意味着为每个节点提供它应该出现在屏幕上的确切坐标。 下一阶段是绘制——渲染树将被遍历，每个节点将使用 UI 后端层进行绘制。

重要的是要了解这是一个渐进的过程。 为了更好的用户体验，渲染引擎会尝试尽快将内容显示在屏幕上。 它不会等到所有 HTML 都被解析后才开始构建和布局渲染树。 部分内容将被解析和显示，同时继续处理来自网络的其余内容。

### 主要流程示例

![图 3：WebKit 主流程](https://web-dev.imgix.net/image/T4FyVKpzu4WKF1kBNvXepbi08t52/S9TJhnMX1cu1vrYuQRqM.png?auto=format&w=1248)

![图 4：Mozilla 的 Gecko 渲染引擎主流程](https://web-dev.imgix.net/image/T4FyVKpzu4WKF1kBNvXepbi08t52/Tbif2mUJCUVyPdyXntZk.jpg?auto=format&w=1248)

从图 3 和图 4 可以看出，尽管 WebKit 和 Gecko 使用的术语略有不同，但流程基本相同。

Gecko 将视觉格式化元素的树称为“框架树”。 每个元素都是一个框架。 WebKit 使用术语“渲染树”，它由“渲染对象”组成。 WebKit 使用术语“布局”来放置元素，而 Gecko 将其称为“重排”。 “附件”是 WebKit 的术语，用于连接 DOM 节点和视觉信息以创建渲染树。 一个微小的非语义差异是 Gecko 在 HTML 和 DOM 树之间有一个额外的层。 它被称为“内容接收器”，是制作 DOM 元素的工厂。 我们将讨论流程的每个部分：

### 解析 - 一般

由于解析是渲染引擎中一个非常重要的过程，我们将更深入地探讨它。让我们从一些关于解析的介绍开始。

解析文档意味着将其转换为代码可以使用的结构。解析的结果通常是代表文档结构的节点树。这称为解析树或语法树。

例如，解析表达式 2 + 3 - 1 可以返回这棵树：

![图 5：数学表达式树节点](https://web-dev.imgix.net/image/T4FyVKpzu4WKF1kBNvXepbi08t52/xNQUG9emGd8FzuOpumP7.png?auto=format&w=800)

### 语法

解析基于文档遵循的语法规则：编写它的语言或格式。您可以解析的每种格式都必须具有由词汇和语法规则组成的确定性语法。 它被称为上下文无关文法。 人类语言不是这样的语言，因此不能用传统的解析技术进行解析。

### Parser - Lexer 组合

解析可以分为两个子过程：词法分析和句法分析。

词法分析是将输入分解为标记的过程。 标记是语言词汇：有效构建块的集合。 在人类语言中，它将包含出现在该语言词典中的所有单词。

句法分析是对语言句法规则的应用。

解析器通常将工作分为两个部分：负责将输入分解为有效标记的词法分析器（有时称为分词器），以及负责根据语言语法规则分析文档结构来构建解析树的解析器。

词法分析器知道如何去除不相关的字符，如空格和换行符。

![图 6：从源文档到解析树](https://web-dev.imgix.net/image/T4FyVKpzu4WKF1kBNvXepbi08t52/TfY1qPDNbZS8iBnlAO4b.png?auto=format&w=202)

解析过程是迭代的。 解析器通常会向词法分析器询问一个新的标记，并尝试将该标记与其中一个语法规则相匹配。 如果一条规则被匹配，一个与该令牌对应的节点将被添加到解析树中，解析器将请求另一个令牌。

如果没有规则匹配，解析器将在内部存储令牌，并不断请求令牌，直到找到匹配所有内部存储令牌的规则。 如果未找到规则，则解析器将引发异常。 这意味着该文档无效并且包含语法错误。

### 翻译

在许多情况下，解析树并不是最终产品。 解析常用于翻译：将输入文档转换为另一种格式。 一个例子是编译。 将源代码编译成机器码的编译器首先将其解析成解析树，然后将解析树翻译成机器码文档。

![图 7：编译流程](https://web-dev.imgix.net/image/T4FyVKpzu4WKF1kBNvXepbi08t52/VhoUBTyHWNnnZJiIfRAo.png?auto=format&w=208)

### 解析示例

在图 5 中，我们从数学表达式构建了一个解析树。 让我们尝试定义一种简单的数学语言并查看解析过程。

句法

1. 语言语法构建块是表达式、术语和操作。
2. 我们的语言可以包含任意数量的表达方式。
3. 表达式定义为“术语”后跟“操作”后跟另一个术语
4. 操作是加号或减号
5. 术语是整数标记或表达式

让我们分析输入 2 + 3 - 1。

匹配规则的第一个子串是 2：根据规则 #5，它是一个术语。 第二个匹配是 2 + 3：这匹配第三个规则：一个术语后跟一个操作，然后是另一个术语。 下一场比赛只会在输入结束时命中。 2 + 3 - 1 是一个表达式，因为我们已经知道 2 + 3 是一个项，所以我们有一个项后跟一个运算，然后是另一个项。 2++ 将不匹配任何规则，因此是无效输入。


### 词汇和句法的正式定义


