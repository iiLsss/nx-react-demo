

## React 如何处理渲染？

### 排队渲染

初始渲染完成后，有几种不同的方式告诉 React 排队重新渲染：

- 函数组件
  - `useState`setters
  - `useReducer`dispatch
- 类组件
  - `this.setState()`
  - `this.forceUpdate()`
- 其他
  - 再次调用 ReactDOM 顶层 `render(<App>)` 方法（相当于在根组件上调用 `forceUpdate()`）
  - 从新的 `useSyncExternalStore` 挂钩触发的更新

请注意，函数组件没有 `forceUpdate` 方法，但您可以通过使用始终递增计数器的 `useReducer` 挂钩获得相同的行为：

```js
const [, forceRender] = useReducer((c) => c + 1, 0);
```


### 标准渲染行为

记住这一点非常重要：

**React 的默认行为是当一个父组件渲染时，React 将递归地渲染它里面的所有子组件！**

例如，假设我们有一个 `A > B > C > D` 的组件树，并且我们已经在页面上显示了它们。用户单击 `B` 中的一个按钮，该按钮会增加一个计数器：

  - 我们在 `B` 中调用 `setState()`，它将 `B` 的重新渲染排队。
  - React 从树的顶部开始渲染过程
  - React 看到 `A` 没有被标记为需要更新，并跳过它
  - React 看到 `B` 被标记为需要更新，并渲染它。 `B` 像上次一样返回 `<C /> `。
  - `C` 最初没有标记为需要更新。然而，因为它的父 `B` 渲染了，React 现在向下移动并渲染 `C`。 `C` 再次返回 `<D />`。
  - `D` 也没有标记为渲染，但是由于它的父级 `C` 渲染了，React 向下移动并渲染 `D`。

以另一种方式重复这个：

默认情况下，渲染一个组件会导致它内部的所有组件也被渲染！

另外，还有一个关键点：

在正常渲染中，React 不关心“props 是否改变”——它会无条件地渲染子组件，因为父组件渲染了！

这意味着在你的根 `<App>` 组件中调用 `setState()` ，没有其他改变改变行为，将导致 React 重新渲染组件树中的每个组件。 毕竟，React 最初的销售宣传之一是“就像我们在每次更新时重新绘制整个应用程序一样”。

现在，树中的大部分组件很可能会返回与上次完全相同的渲染输出，因此 React 不需要对 DOM 进行任何更改。 但是，React 仍然需要完成要求组件自行渲染和区分渲染输出的工作。 这两者都需要时间和精力。

请记住，渲染并不是一件坏事——它是 React 知道它是否需要实际对 DOM 进行任何更改的方式！

### React 渲染规则

React 渲染的主要规则之一是渲染必须是“纯粹的”并且没有任何副作用！

这可能会很棘手和令人困惑，因为许多副作用并不明显，也不会导致任何破坏。 例如，严格来说 `console.log()` 语句是一种副作用，但它实际上不会破坏任何东西。 改变道具绝对是一种副作用，它可能不会破坏任何东西。 在呈现过程中进行 AJAX 调用也绝对是一种副作用，并且根据请求的类型肯定会导致意外的应用程序行为。

Sebastian Markbage 写了一篇很棒的文档，名为 [The Rules of React](https://gist.github.com/sebmarkbage/75f0838967cd003cd7f9ab938eb1958f)。 在其中，他定义了不同 React 生命周期方法（包括渲染）的预期行为，以及哪些类型的操作被认为是安全的“纯”操作，哪些是不安全的。 值得完整阅读，但我将总结要点：

- 渲染逻辑不能
  - 不能改变现有的变量和对象
  - 不能创建像 `Math.random()` 或 `Date.now()` 这样的随机值
  - 不能发起网络请求
  - 不能排队状态更新
- 渲染逻辑可以
  - 改变渲染时新创建的对象
  - 抛出错误
  - 尚未创建的延迟初始化数据，例如缓存值


### Component Metadata and Fibers

React 存储一个内部数据结构，用于跟踪应用程序中存在的所有当前组件实例。该数据结构的核心部分是一个称为“Fiber”的对象，它包含描述以下内容的元数据字段：

  - 此时应该在组件树中呈现什么组件类型
  - 与此组件关联的当前道具和状态
  - 指向父组件、兄弟组件和子组件的指针
  - React 用于跟踪渲染过程的其他内部元数据

如果您听说过用于描述 React 版本或功能的短语“React Fiber”，那实际上指的是 React 内部结构的重写，将渲染逻辑切换为依赖这些“Fiber”对象作为关键数据结构。 它作为 React 16.0 发布，因此从那以后的每个 React 版本都使用了这种方法。

Fiber 类型的简化版本如下所示：
```js
export type Fiber = {
  // Tag identifying the type of fiber.
  tag: WorkTag;

  // Unique identifier of this child.
  key: null | string;

  // The resolved function/class/ associated with this fiber.
  type: any;

  // Singly Linked List Tree Structure.
  child: Fiber | null;
  sibling: Fiber | null;
  index: number;

  // Input is the data coming into this fiber (arguments/props)
  pendingProps: any;
  memoizedProps: any; // The props used to create the output.

  // A queue of state updates and callbacks.
  updateQueue: Array<State | StateUpdaters>;

  // The state used to create the output
  memoizedState: any;

  // Dependencies (contexts, events) for this fiber, if any
  dependencies: Dependencies | null;
};
```

([You can see](https://github.com/facebook/react/blob/v18.0.0/packages/react-reconciler/src/ReactInternalTypes.js#L64-L193))

在渲染过程中，React 将遍历这个 fiber 对象树，并在计算新的渲染结果时构建一个更新的树。

请注意，这些“fiber”对象存储真实的组件属性和状态值。 当你在组件中使用 `props` 和 `state` 时，React 实际上让你可以访问存储在 fiber 对象上的值。 事实上，特别是对于类组件，React 在渲染之前显式地将 `componentInstance.props = newProps` 复制到组件。 因此，`this.props` 确实存在，但它存在的唯一原因是 React 从其内部数据结构中复制了引用。 从这个意义上说，组件有点像 React 的 fiber 对象的外观。

类似地，React hooks 之所以起作用，是因为 React 将组件的所有 hooks 存储为附加到该组件的 fiber 对象的链表。 当 React 渲染一个函数组件时，它会从 fiber 中获取钩子描述条目的链表，并且每次你调用另一个钩子时，它都会返回存储在钩子描述对象中的适当值（比如 useReducer 的状态和调度值）.

当父组件第一次渲染给定的子组件时，React 会创建一个 fiber 对象来跟踪组件的“实例”。 对于类组件，它直接调用 `const instance = new YourComponentType(props)` 并将实际的组件实例保存到 fiber 对象上。 对于函数组件，React 只是将 `YourComponentType(props)` 作为函数调用。


### 组件类型和协调

正如“Reconciliation”文档页面中所述，React 试图通过尽可能多地重用现有组件树和 DOM 结构来提高重新渲染期间的效率。 如果您要求 React 在树中的相同位置呈现相同类型的组件或 HTML 节点，React 将重用它并在适当时应用更新，而不是从头开始重新创建它。 这意味着只要您不断要求 React 在同一位置渲染该组件类型，React 就会使组件实例保持活动状态。 对于类组件，它实际上确实使用了组件的相同实际实例。 函数组件不像类那样没有真正的“实例”，但我们可以将 `<MyFunctionComponent />` 视为表示“这种类型的组件在这里显示并保持活动状态”的“实例”。

那么，React 如何知道输出实际发生变化的时间和方式？

React 的渲染逻辑首先根据元素的类型字段比较元素，使用 `===` 引用比较。 如果给定位置中的元素已更改为不同的类型，例如从 `<div>` 到 `<span>` 或从 `<ComponentA>` 到 `<ComponentB>`，React 将通过假设整个树已更改来加速比较过程。 结果，React 将销毁整个现有的组件树部分，包括所有 DOM 节点，并使用新的组件实例从头开始重新创建它。

这意味着您绝不能在渲染时创建新的组件类型！每当你创建一个新的组件类型时，它就是一个不同的引用，这将导致 React 反复销毁和重新创建子组件树。

换句话说，不要这样做：

```js
// ❌ BAD!
// This creates a new `ChildComponent` reference every time!
function ParentComponent() {
  function ChildComponent() {
    return <div>Hi</div>;
  }

  return <ChildComponent />;
}
```

相反，始终单独定义组件：

```js
// ✅ GOOD
// This only creates one component type reference
function ChildComponent() {
  return <div>Hi</div>;
}

function ParentComponent() {
  return <ChildComponent />;
}
```

### Keys and Reconciliation 

React 识别组件“实例”的另一种方式是通过 `key` pseudo-prop。 React 使用 `key` 作为唯一标识符，它可以用来区分组件类型的特定实例。

请注意， key 实际上并不是真正的道具——它是 React 的指令。 React 总是会把它去掉，它永远不会传递给实际的组件，所以你永远不会有 props.key——它永远是未定义的。

我们使用`key`的主要地方是渲染列表。 如果您正在呈现可能以某种方式更改的数据，例如重新排序、添加或删除列表条目，则键在这里尤为重要。 在这里特别重要的是，如果可能的话，键应该是数据中的某种唯一 ID - 仅使用数组索引作为`key`作为最后的后备手段！

```js
// ✅ Use a data object ID as the key for list items
todos.map((todo) => <TodoListItem key={todo.id} todo={todo} />);
```

这是为什么这很重要的一个例子。 假设我渲染了一个包含 10 个 `<TodoListItem>` 组件的列表，使用数组索引作为`key`。 React 看到 10 个项目，键为 `0..9`。 现在，如果我们删除第 6 项和第 7 项，并在末尾添加三个新条目，我们最终会渲染`key`为 `0..10` 的项目。 所以，在 React 看来，我真的只是在末尾添加了一个新条目，因为我们从 10 个列表项变成了 11 个。React 将愉快地重用现有的 DOM 节点和组件实例。 但是，这意味着我们现在可能正在渲染 `<TodoListItem key={6}>` 以及传递给列表项 #8 的待办事项。 因此，组件实例仍然存在，但现在它获得了一个与以前不同的数据对象作为 prop。 这可能有效，但也可能产生意外行为。 此外，React 现在必须对多个列表项应用更新以更改文本和其他 DOM 内容，因为现有列表项现在必须显示与以前不同的数据。 这些更新在这里真的没有必要，因为这些列表项都没有改变。

相反，如果我们为每个列表项使用 `key={todo.id}`，React 将正确地看到我们删除了两个项目并添加了三个新项目。 它将销毁两个已删除的组件实例及其关联的 DOM，并创建三个新的组件实例及其 DOM。 这比必须不必要地更新实际上没有更改的组件要好。

`key`对于列表之外的组件实例标识也很有用。 您可以随时向任何 React 组件添加一个`key`以指示其身份，更改该`key`将导致 React 销毁旧的组件实例和 DOM 并创建新的组件实例和 DOM。 一个常见的用例是列表 + 详细信息表单组合，其中表单显示当前所选列表项的数据。 呈现 `<DetailForm key={selectedItem.id}>` 将导致 React 在所选项目更改时销毁并重新创建表单，从而避免表单内陈旧状态的任何问题。

### 渲染批处理和计时

默认情况下，每次调用 `setState()` 都会导致 React 开始一个新的渲染通道，同步执行它，然后返回。 然而，React 也以渲染批处理的形式自动应用一种优化。 渲染批处理是指多次调用 `setState()` 导致单个渲染通道排队并执行，通常会有轻微延迟。

React 社区经常将此描述为“状态更新可能是异步的”。 新的 React 文档也将其描述为“State is a Snapshot”。 这是对此渲染批处理行为的引用。

在 React 17 及更早版本中，React 仅在 React 事件处理程序（例如 `onClick` 回调）中进行批处理。 在事件处理程序之外排队的更新，例如在 `setTimeout` 中、在`await`之后或在普通 JS 事件处理程序中，不会排队，并且每个都会导致单独的重新渲染。

然而，[React 18 现在对在任何单个事件循环滴答中排队的所有更新进行“自动批处理”](https://github.com/reactwg/react-18/discussions/21)。这有助于减少所需渲染的总数。

让我们看一个具体的例子。

```js
const [counter, setCounter] = useState(0);

const onClick = async () => {
  setCounter(0);
  setCounter(1);

  const data = await fetchSomeData();

  setCounter(2);
  setCounter(3);
};
```

使用 React 17，这执行了三个渲染过程。 第一遍将 `setCounter(0)` 和 `setCounter(1)` 一起批处理，因为它们都发生在原始事件处理程序调用堆栈期间，因此它们都发生在 `unstable_batchedUpdates()` 调用中。

但是，对 `setCounter(2)` 的调用是在 `await` 之后发生的。 这意味着原始的同步调用堆栈已经完成，函数的后半部分在一个完全独立的事件循环调用堆栈中运行得更晚。 因此，React 将在 `setCounter(2)` 调用的最后一步同步执行整个渲染过程，完成渲染过程，然后从 `setCounter(2)` 返回。

`setCounter(3)` 也会发生同样的事情，因为它也在原始事件处理程序之外运行，因此在批处理之外。

但是，对于 React 18，这会执行两次渲染过程。 前两个，`setCounter(0)` 和 `setCounter(1)`，是一起批处理的，因为它们在一个事件循环中。 后来，在 `await` 之后，`setCounter(2) `和 `setCounter(3)` 被一起批处理 - 尽管它们晚了很多，但也是在同一个事件循环中排队的两个状态更新，所以它们被批处理到第二个渲染中。


### 异步渲染、闭包和状态快照

我们经常看到的一个极其常见的错误是当用户设置了一个新值，然后尝试记录现有的变量名称。但是，记录的是原始值，而不是更新后的值。

```js
function MyComponent() {
  const [counter, setCounter] = useState(0);

  const handleClick = () => {
    setCounter(counter + 1);
    // ❌ THIS WON'T WORK!
    console.log(counter);
    // Original value was logged - why is this not updated yet??????
  };
}
```
那么，为什么这不起作用？

如上所述，有经验的用户常说“React 状态更新是异步的”。这在某种程度上是正确的，但还有更多细微差别，实际上这里有几个不同的问题在起作用。

严格来说，React 渲染实际上是同步的——它将在这个事件循环结束时在一个“微任务”中执行。 （诚然，这是迂腐的，但本文的目标是准确的细节和清晰度。）但是，是的，从 `handleClick` 函数的角度来看，它是“异步的”，因为您无法立即看到结果，并且 实际更新比 `setCounter()` 调用晚得多。

但是，还有一个更大的原因导致它不起作用。 `handleClick` 函数是一个“闭包”——它只能看到定义函数时存在的变量值。 换句话说，这些状态变量是时间的快照。

由于 `handleClick` 是在此函数组件的最近一次渲染期间定义的，因此它只能看到在该渲染过程中存在的计数器的值。 当我们调用 `setCounter()` 时，它会排队等待未来的渲染过程，并且未来的渲染将有一个带有新值的新计数器变量和一个新的 `handleClick` 函数... 但是 `handleClick` 的这个副本将永远无法看到那个新值。

新的 React 文档在 [State as a Snapshot](https://beta.reactjs.org/learn/state-as-a-snapshot) 部分对此进行了更详细的介绍，强烈推荐阅读。

回到最初的示例：在设置更新值后立即尝试使用变量几乎总是错误的方法，这表明您需要重新考虑如何尝试使用该值。

### 渲染行为边缘案例

**提交阶段生命周期**

在提交阶段生命周期方法中还有一些额外的边缘情况：`componentDidMount`、`componentDidUpdate` 和 `useLayoutEffect`。 它们的存在主要是为了允许您在渲染之后但在浏览器有机会绘制之前执行额外的逻辑。 特别是，一个常见的用例是：

- 第一次使用部分但不完整的数据渲染组件
- 在commit-phase生命周期中，使用refs来衡量页面中实际DOM节点的真实大小
- 根据这些测量值在组件中设置一些状态
- 立即使用更新后的数据重新渲染

在此用例中，我们根本不希望用户看到初始的“部分”呈现的 UI——我们只希望显示“最终”UI。 浏览器将在修改 DOM 结构时重新计算它，但当 JS 脚本仍在执行并阻止事件循环时，它们实际上不会在屏幕上绘制任何内容。 因此，您可以执行多个 DOM 更改，例如 `div.innerHTML = "a"`; `div.innerHTML = "b"`;，并且`"a"`永远不会出现。

因此，React 将始终在提交阶段生命周期中同步运行渲染。 这样，如果您确实尝试执行类似“部分-> 最终”开关的更新，屏幕上只会显示“最终”内容。

据我所知，`useEffect` 回调中的状态更新已排队，并在所有 `useEffect` 回调完成后在“被动效果”阶段结束时刷新。

**协调器批处理方法**

React 协调器（ReactDOM、React Native）有改变渲染批处理的方法。

对于 React 17 及更早版本，您可以将事件处理程序之外的多个更新包装在 `unstable_batchedUpdates()` 中以将它们一起批处理。 （请注意，尽管有 `unstable_ `前缀，它在 Facebook 和公共图书馆的代码中被大量使用和依赖 - React-Redux v7 在内部使用 `unstable_batchedUpdates`）

由于 React 18 默认自动批处理，React 18 有一个 `flushSync()` API，您可以使用它强制立即渲染并选择退出自动批处理。

请注意，由于这些是特定于协调器的 API，因此 `react-three-fiber` 和 `ink` 等替代协调器可能不会公开它们。 检查 API 声明或实现细节以查看可用的内容。

**`<StrictMode>`**

React 将在开发中的 `<StrictMode>` 标签内双重渲染组件。 这意味着您的渲染逻辑运行的次数与提交的渲染通道数不同，并且您不能在渲染时依赖 `console.log()` 语句来计算已发生的渲染次数。 相反，要么使用 React DevTools Profiler 来捕获跟踪并计算总体提交渲染的数量，要么在 `useEffect` 挂钩或 `componentDidMount/Update` 生命周期内添加日志记录。 这样，日志只会在 React 实际完成渲染过程并提交时才会打印。

**渲染时设置状态**

在正常情况下，您永远不应该在实际渲染逻辑中对状态更新进行排队。 换句话说，创建一个在点击发生时调用 `setSomeState()` 的点击回调是可以的，但您不应该将 `setSomeState()` 作为实际呈现行为的一部分调用。

但是，有一个例外。 函数组件可以在渲染时直接调用 `setSomeState()`，只要它是有条件地完成并且不会在每次该组件渲染时都执行。 这相当于类组件中 `getDerivedStateFromProps` 的函数组件。 如果一个功能组件在渲染时排队状态更新，React 将立即应用状态更新并在继续之前同步重新渲染该组件。 如果组件无限地保持排队状态更新并强制 React 重新渲染它，React 将在一定次数的重试后中断循环并抛出错误（目前尝试 50 次）。 该技术可用于根据道具更改立即强制更新状态值，而无需重新渲染 + 调用 `useEffect` 中的 `setSomeState()`。


## 提高渲染性能

尽管渲染是 React 工作方式的正常预期部分，但渲染工作有时也确实是“浪费”的工作。 如果一个组件的渲染输出没有改变，那部分 DOM 不需要更新，那么渲染那个组件的工作真的是在浪费时间。

React 组件渲染输出应该始终完全基于当前 props 和当前组件状态。 因此，如果我们提前知道一个组件的 props 和 state 没有改变，我们也应该知道渲染输出将是相同的，这个组件不需要改变，我们可以安全地跳过 渲染它。

一般而言，在尝试提高软件性能时，有两种基本方法：1) 更快地完成相同的工作，以及 2) 减少工作量。 优化 React 渲染主要是通过在适当的时候跳过渲染组件来减少工作量。

### 组件渲染优化技术

React 提供了三个主要的 API，使我们可以跳过渲染组件：

主要方法是 `React.memo()`，一种内置的“高阶组件”类型。 它接受您自己的组件类型作为参数，并返回一个新的包装器组件。 包装器组件的默认行为是检查是否有任何 `props` 发生了变化，如果没有，则阻止重新渲染。 函数组件和类组件都可以使用 `React.memo()` 进行包装。 （可以传入一个自定义比较回调，但它实际上只能比较新旧道具，所以自定义比较回调的主要用例只是比较特定的道具字段，而不是所有道具字段。）

其他选项是：

  - `React.Component.shouldComponentUpdate`：一个可选的类组件生命周期方法，将在渲染过程的早期调用。 如果它返回 `false`，React 将跳过渲染组件。 它可能包含任何你想用来计算布尔结果的逻辑，但最常见的方法是检查组件的 props 和状态自上次以来是否发生了变化，如果没有变化则返回 `false`。
  - `React.PureComponent`: 因为 props 和 state 的比较是实现 `shouldComponentUpdate` 的最常见方式，`PureComponent` 基类默认实现了该行为，并且可以用来代替 `Component` + `shouldComponentUpdate`。

所有这些方法都使用一种称为“浅层相等”的比较技术。 这意味着检查两个不同对象中的每个单独字段，并查看对象的任何内容是否具有不同的值。 换句话说，`obj1.a === obj2.a && obj1.b === obj2.b && .........` 这通常是一个快速的过程，因为 `===` 比较对于 JS引擎来做。 因此，这三种方法相当于 `const shouldRender = !shallowEqual(newProps, prevProps)`。

还有一个鲜为人知的技术：如果 React 组件在其渲染输出中返回与上次完全相同的元素引用，React 将跳过重新渲染该特定子组件。 至少有几种方法可以实现这种技术：
  - 如果您在输出中包含 `props.children`，那么如果此组件执行状态更新，则该元素是相同的
  - 如果你用 useMemo() 包装一些元素，这些元素将保持不变，直到依赖项发生变化

```js
// The `props.children` content won't re-render if we update state
function SomeProvider({ children }) {
  const [counter, setCounter] = useState(0);

  return (
    <div>
      <button onClick={() => setCounter(counter + 1)}>Count: {counter}</button>
      <OtherChildComponent />
      {children}
    </div>
  );
}

function OptimizedParent() {
  const [counter1, setCounter1] = useState(0);
  const [counter2, setCounter2] = useState(0);

  const memoizedElement = useMemo(() => {
    // This element stays the same reference if counter 2 is updated,
    // so it won't re-render unless counter 1 changes
    return <ExpensiveChildComponent />;
  }, [counter1]);

  return (
    <div>
      <button onClick={() => setCounter1(counter1 + 1)}>
        Counter 1: {counter1}
      </button>
      <button onClick={() => setCounter1(counter2 + 1)}>
        Counter 2: {counter2}
      </button>
      {memoizedElement}
    </div>
  );
}

```

从概念上讲，我们可以说这两种方法之间的区别是：

- `React.memo()`：由子组件控制
- 同元素引用：由父组件控制

对于所有这些技术，跳过渲染一个组件意味着 React 也将跳过渲染整个子树，因为它有效地设置了一个停止标志来停止默认的“递归渲染子组件”行为。

## 新 props 引用如何影响渲染优化

我们已经看到，默认情况下，React 会重新渲染所有嵌套组件，即使它们的 props 没有改变。 这也意味着将新引用作为 props 传递给子组件并不重要，因为无论您是否传递相同的 props，它都会渲染。 所以，这样的事情完全没问题：

```js
function ParentComponent() {
  const onClick = () => {
    console.log('Button clicked');
  };

  const data = { a: 1, b: 2 };

  return <NormalChildComponent onClick={onClick} data={data} />;
}
```

每次 `ParentComponent` 渲染时，它都会创建一个新的 `onClick` 函数引用和一个新的`data`对象引用，然后将它们作为 props 传递给 `NormalChildComponent。` （请注意，我们是使用 function 关键字还是将 onClick 定义为箭头函数并不重要——无论哪种方式，它都是一个新的函数引用。）

这也意味着没有必要尝试通过将它们包装在 `React.memo()` 中来优化“host components”（如 `<div>` 或 `<button>`）的渲染。 这些基本组件下面没有子组件，所以渲染过程无论如何都会停在那里。

但是，如果子组件试图通过检查 props 是否已更改来优化渲染，那么将新的引用作为 props 传递将导致子组件进行渲染。 如果新的 prop 引用实际上是新数据，这很好。 但是，如果父组件只是传递一个回调函数呢？

```js
const MemoizedChildComponent = React.memo(ChildComponent);

function ParentComponent() {
  const onClick = () => {
    console.log('Button clicked');
  };

  const data = { a: 1, b: 2 };

  return <MemoizedChildComponent onClick={onClick} data={data} />;
}

```

现在，每次 `ParentComponent` 渲染时，这些新引用将导致 `MemoizedChildComponent` 看到其道具值已更改为新引用，并且它将继续并重新渲染......即使 `onClick` 函数和`data`对象应该是 基本上每次都一样！

这意味着：

- `MemoizedChildComponent` 总是会重新渲染，即使我们想在大多数时候跳过渲染
- 它正在做的比较新旧道具的工作是浪费精力

同样，请注意渲染 `<MemoizedChild><OtherComponent /></MemoizedChild>` 也会强制孩子始终渲染，因为 `props.children` 始终是新引用。

### 优化 props 引用

类组件不必担心意外创建新的回调函数引用，因为它们可以拥有始终是相同引用的实例方法。 但是，他们可能需要为单独的子列表项生成唯一的回调，或者在匿名函数中捕获一个值并将其传递给子项。 这些将导致新的引用，因此将在渲染时创建新对象作为子道具。 React 没有内置任何东西来帮助优化这些情况。

对于函数组件，React 确实提供了两个钩子来帮助您重用相同的引用：`useMemo` 用于创建对象或进行复杂计算等任何类型的通用数据，以及 `useCallback` 专门用于创建回调函数。

### 记住一切？

如上所述，您不必在作为 prop 传递的每个函数或对象上都抛出 `useMemo` 和 `useCallback` - 只有当它会对孩子的行为产生影响时。 （也就是说，useEffect 的依赖数组比较确实增加了另一个用例，孩子可能希望接收一致的 props 引用，这确实使事情变得更加复杂。）

另一个经常出现的问题是“为什么 React 默认不将所有内容包装在 React.memo() 中？”

Dan Abramov 反复指出，memoization 仍然会产生比较 props 的成本，并且在很多情况下，memoization 检查永远无法阻止重新渲染，因为组件总是会收到新的 props。 例如，请参阅来自 Dan 的 Twitter 帖子：

> 为什么 React 不默认将 memo() 放在每个组件周围？ 不是更快吗？ 我们应该做一个基准来检查吗？
> 问你自己：
> 你为什么不把 Lodash memoize() 放在每个函数周围？ 这不会使所有功能更快吗？ 我们需要一个基准吗？ 为什么不？

此外，虽然我没有关于它的特定链接，但由于人们正在改变数据而不是不可变地更新数据，因此尝试默认将其应用于所有组件可能会导致错误。

我已经在 Twitter 上与 Dan 就此进行了一些公开讨论。 我个人认为，广泛使用 `React.memo()` 可能会在整体应用程序渲染性能方面获得净收益。 正如我去年在一个扩展的 Twitter 线程中所说的那样：

> React 社区作为一个整体似乎过度沉迷于“perf”，但大部分讨论都围绕着通过 Medium 帖子和 Twitter 评论流传下来的过时的“部落智慧”展开，而不是基于具体的用法。
> 对于“渲染”的概念和性能影响，肯定存在集体误解。是的，React 完全基于渲染——必须渲染才能做任何事情。不，大多数渲染并不过分昂贵。
> “浪费”的重新渲染当然不是世界末日。 也不是从根重新渲染整个应用程序。 也就是说，没有 DOM 更新的“浪费”重新渲染是不需要燃烧的 CPU 周期也是事实。 这对大多数应用程序来说是个问题吗？ 可能不会。 这是可以改进的吗？ 大概。
> 是否有默认的“全部重新渲染”方法不够用的应用程序？当然，这就是 sCU、PureComponent 和 memo() 存在的原因。
> 用户应该默认将所有内容包装在 memo() 中吗？ 可能不会，因为您应该考虑应用程序的性能需求。 如果你这样做真的会受伤吗？ 不，实际上我希望它确实有净收益（尽管 Dan 关于浪费比较的观点）
> 基准测试是否存在缺陷，结果是否因场景和应用程序而异？ 当然。 也就是说，如果人们可以开始为这些讨论指出硬性数字而不是玩“我曾经看过一条评论……”的电话游戏，那将真的非常有帮助。
> 我很乐意看到来自 React 团队和更大社区的大量基准套件来衡量大量场景，这样我们就可以一劳永逸地停止争论这些东西。 函数创建、渲染成本、优化……请提供具体证据！

但是，没有人将任何好的基准放在一起来证明这是否属实：

> Dan 的标准答案是应用程序结构和更新模式千差万别，因此很难做出具有代表性的基准。 我仍然认为一些实际数字将有助于讨论

在 React 问题中还有一个关于“什么时候不应该使用 React.memo？”的扩展问题讨论。

请注意，新的 React 文档专门解决了“备忘录一切？”的问题。 题：

> 只有当您的组件经常使用完全相同的道具重新渲染并且其重新渲染逻辑代价高昂时，使用 `memo` 进行优化才有价值。 如果您的组件重新渲染时没有明显的延迟，则不需要备忘录。 请记住，如果传递给组件的 props 总是不同的，例如传递一个对象或在渲染期间定义的普通函数，那么 `memo` 是完全无用的。 这就是为什么您经常需要将 `useMemo` 和 `useCallback` 与 `memo` 一起使用。

有关避免不必要的记忆和提高性能的更多建议，请参阅该链接下的详细信息部分。

### 不变性和重新渲染 Immutability and Rerendering

React 中的状态更新应该始终保持不变。主要原因有两个：

  - 根据您改变的内容和位置，它可能会导致组件在您预期它们会渲染时不渲染
  - 它会导致混淆数据实际更新的时间和原因

让我们看几个具体的例子。

正如我们所见，`React.memo / PureComponent / shouldComponentUpdate` 都依赖于当前 props 与之前 props 的浅层相等性检查。 因此，期望我们可以通过 `props.someValue !== prevProps.someValue` 知道一个 prop 是否是一个新值。

如果你改变，那么 someValue 是相同的引用，那些组件将假定没有任何改变。

请注意，这特别适用于我们试图通过避免不必要的重新渲染来优化性能的情况。 如果道具没有改变，渲染是“不必要的”或“浪费的”。 如果你改变，组件可能会错误地认为什么都没有改变，然后你想知道为什么组件没有重新渲染。

另一个问题是 `useState` 和 `useReducer` 挂钩。 每次我调用 `setCounter()` 或 `dispatch()` 时，React 都会排队重新渲染。 然而，React 要求任何钩子状态更新必须传入/返回一个新的引用作为新的状态值，无论它是一个新的对象/数组引用，还是一个新的原语（字符串/数字/等）。

React 在渲染阶段应用所有状态更新。 当 React 尝试从钩子应用状态更新时，它会检查新值是否是相同的引用。 React 将始终完成渲染排队更新的组件。 但是，如果该值与之前的引用相同，并且没有其他继续渲染的原因（例如父级已渲染），React 将丢弃组件的渲染结果并完全退出渲染过程。 所以，如果我像这样改变一个数组：

```js
const [todos, setTodos] = useState(someTodosArray);

const onClick = () => {
  todos[3].completed = true;
  setTodos(todos);
};
```

那么组件将无法重新渲染。

（请注意，React 实际上有一个“快速路径”救助机制，在某些情况下会在状态更新排队之前尝试检查新值。由于这也依赖于直接引用检查，这是另一个需要进行不可变更新的示例 .)

从技术上讲，只有最外层的引用必须不可变地更新。如果我们将该示例更改为：

```js
const onClick = () => {
  const newTodos = todos.slice();
  newTodos[3].completed = true;
  setTodos(newTodos);
};
```

然后我们创建了一个新的数组引用并将其传入，组件将重新渲染。

请注意，类组件 `this.setState()` 与函数组件 `useState` 和 `useReducer` 挂钩在突变和重新渲染方面的行为存在明显差异。 `this.setState()` 根本不在乎你是否改变——它总是完成重新渲染。 所以，这将重新渲染：

```js
const { todos } = this.state;
todos[3].completed = true;
this.setState({ todos });
```

事实上，像 `this.setState({})` 这样的空对象也会被传入。

除了所有实际的渲染行为之外，突变还给标准的 React 单向数据流带来了混乱。 当期望值根本没有改变时，突变会导致其他代码看到不同的值。 这使得更难知道给定状态实际上应该更新的时间和原因，或者更改来自何处。

底线：React 和 React 生态系统的其余部分假定更新是不可变的。 任何时候你改变，你都会冒着出现错误的风险。 不要这样做。

### 测量 React 组件渲染性能

使用 React DevTools Profiler 查看每次提交中呈现的组件。 找到意外渲染的组件，使用 DevTools 找出它们渲染的原因，并修复问题（可能通过将它们包装在 React.memo() 中，或者让父组件记住它传递下来的道具。）

另外，请记住，React 在开发构建中运行得更慢。 您可以在开发模式下分析您的应用程序以查看正在渲染的组件以及原因，并对渲染组件所需的相对时间进行一些比较（“组件 B 在此提交中渲染的时间是组件 A 的 3 倍 “ 做过）。 但是，永远不要使用 React 开发构建来测量绝对渲染时间——只使用生产构建来测量绝对时间！ （否则 Dan Abramov 将不得不因为使用不准确的数字而对您大喊大叫）。 请注意，如果您想实际使用分析器从类似产品的构建中捕获计时数据，则需要使用 React 的特殊“分析”构建。

## 上下文和渲染行为

React 的上下文 API 是一种机制，用于使单个用户提供的值可用于组件的子树，给定 `<MyContext.Provider>` 内的任何组件都可以从该上下文实例中读取值，而不必显式地将该值作为 通过每个中间组件进行支撑。

上下文不是“状态管理”工具。 您必须自己管理传递到上下文中的值。 这通常是通过将数据保持在 React 组件状态并基于该数据构建上下文值来完成的。

### 上下文基础

上下文提供者接收单个值 prop，例如 `<MyContext.Provider value={42}>`。 子组件可以通过渲染上下文消费者组件并提供渲染道具来使用上下文，例如： `<MyContext.Consumer>{ (value) => <div>{value}</div>}</MyContext.Consumer>` 或者通过在函数组件中调用 `useContext` 钩子：`const value = useContext(MyContext)`

### 更新上下文值

当周围组件呈现提供者时，React 检查上下文提供者是否已被赋予新值。 如果提供者的值是一个新的引用，那么 React 就知道该值已经改变，并且需要更新使用该上下文的组件。

请注意，将新对象传递给上下文提供程序将导致它更新：

```js
function GrandchildComponent() {
  const value = useContext(MyContext);
  return <div>{value.a}</div>;
}

function ChildComponent() {
  return <GrandchildComponent />;
}

function ParentComponent() {
  const [a, setA] = useState(0);
  const [b, setB] = useState('text');

  const contextValue = { a, b };

  return (
    <MyContext.Provider value={contextValue}>
      <ChildComponent />
    </MyContext.Provider>
  );
}
```

在此示例中，每次 `ParentComponent` 渲染时，React 都会注意到 `MyContext.Provider` 已被赋予新值，并在继续向下循环时寻找使用 `MyContext` 的组件。 当上下文提供者有一个新值时，每个使用该上下文的嵌套组件都将被强制重新渲染。

请注意，从 React 的角度来看，每个上下文提供者只有一个值——不管它是一个对象、数组还是一个原始值，它只是一个上下文值。 目前，使用上下文的组件无法跳过由新上下文值引起的更新，即使它只关心新值的一部分。

如果组件只需要 `value.a`，并且进行更新以产生新的 `value.b` 引用......不可变更新和上下文渲染的规则也要求该值也是一个新引用，因此组件读取 `value.a` 也会渲染。

### 状态更新、上下文和重新渲染

是时候将这些部分放在一起了。我们知道：

- 调用 `setState()` 将该组件的渲染排队
- React 默认递归渲染嵌套组件
- 上下文提供者由呈现它们的组件赋予一个值
- 该值通常来自该父组件的状态

这意味着默认情况下，对呈现上下文提供程序的父组件的任何状态更新都会导致其所有后代重新呈现，无论它们是否读取上下文值！

如果我们回顾上面的 `Parent/Child/Grandchild` 示例，我们可以看到 `GrandchildComponent` 将重新渲染，但不是因为上下文更新 - 它会重新渲染，因为 `ChildComponent` 渲染了！。在这个例子中，没有试图优化掉“不必要”的渲染，所以 React 在 `ParentComponent` 渲染时默认渲染 `ChildComponent` 和 `GrandchildComponent。` 如果父级将新的上下文值放入 `MyContext.Provider`，`GrandchildComponent` 将在呈现并使用它时看到新值，但上下文更新不会导致 `GrandchildComponent` 呈现 - 它无论如何都会发生。

### 上下文更新和渲染优化

让我们修改该示例，使其真正尝试优化事物，但我们将通过在底部放置一个 GreatGrandchildComponent 来添加另一个变化:

```js
function GreatGrandchildComponent() {
  return <div>Hi</div>
}

function GrandchildComponent() {
  const value = useContext(MyContext);
  return (
    <div>
      {value.a}
      <GreatGrandchildComponent />
    </div>
}

function ChildComponent() {
  return <GrandchildComponent />
}

const MemoizedChildComponent = React.memo(ChildComponent);

function ParentComponent() {
  const [a, setA] = useState(0);
  const [b, setB] = useState("text");

  const contextValue = {a, b};

  return (
    <MyContext.Provider value={contextValue}>
      <MemoizedChildComponent />
    </MyContext.Provider>
  )
}
```

现在，如果我们调用 setA(42)：


- `ParentComponent` 将呈现
- 创建了一个新的 `contextValue` 引用
- React 看到 `MyContext.Provider` 有一个新的上下文值，因此需要更新 `MyContext` 的任何消费者
- React 将尝试渲染 `MemoizedChildComponent`，但看到它被包裹在 `React.memo()` 中。根本没有任何道具被传递，所以道具实际上并没有改变。 React 将完全跳过渲染 `ChildComponent`。
- 但是，`MyContext.Provider` 有一个更新，因此可能有更深层次的组件需要了解它。
- React 继续向下，到达 `GrandchildComponent。` 它看到 `MyContext` 被 `GrandchildComponent` 读取，因此它应该重新呈现，因为有一个新的上下文值。 React 继续并重新渲染 `GrandchildComponent`，特别是因为上下文更改。
- 因为 `GrandchildComponent` 确实渲染了，所以 React 会继续进行并渲染其中的任何内容。所以，React 也会重新渲染 `GreatGrandchildComponent`。

换句话说，正如 Sophie Alpert 所说：

> 上下文提供者下的 React 组件可能应该使用 React.memo

这样，父组件中的状态更新将不会强制每个组件重新渲染，只会强制读取上下文的部分。 （您也可以通过让 `ParentComponent` 渲染 `<MyContext.Provider>{props.children}</MyContext.Provider>` 获得基本相同的结果，它利用“相同元素引用”技术来避免子组件重新渲染，然后再渲染 `<ParentComponent><ChildComponent /></ParentComponent>` 从上一层。）

但是请注意，一旦 `GrandchildComponent` 基于下一个上下文值进行渲染，React 就会立即返回其默认行为，即递归地重新渲染所有内容。 所以，`GreatGrandchildComponent` 被渲染了，下面的任何其他东西也会被渲染。

### 上下文和渲染器边界

通常，React 应用程序完全使用单个渲染器构建，例如 ReactDOM 或 React Native。 但是，核心渲染和协调逻辑作为一个名为 `react-reconciler` 的包发布，您可以使用它来构建您自己的针对其他环境的 React 版本。 很好的例子是 `react-three-fiber`，它使用 React 来驱动 Three.js 模型和 WebGL 渲染，以及 ink，它使用 React 绘制终端文本 UI。

一个长期存在的限制是，如果您在一个应用程序中有多个渲染器，例如在 ReactDOM 中显示 React-Three-Fiber 内容，上下文提供程序将不会通过渲染器边界。所以，如果组件树看起来像这样：

```
function App() {
  return (
    <MyContext.Provider>
      <DomComponent>
        <ReactThreeFiberParent>
          <ReactThreeFiberChild />
        </ReactThreeFiberParent>
      </DomComponent>
    </MyContext.Provider>
  );
}
```

其中 `ReactFiberParent` 创建并显示使用 React-Three-Fiber 呈现的内容，然后 `<ReactThreeFiberChild>` 将无法看到来自 `<MyContext.Provider>` 的值。

这是 React 的一个已知限制，目前没有正式的方法来解决这个问题。

也就是说，React-Three-Fiber 背后的 Poimandres 组织有一些使上下文桥接可行的内部黑客，他们最近发布了一个名为 https://github.com/pmndrs/its-fine 的库，其中包含一个 useContextBridge 钩子，它是 一个有效的解决方法。

## React-Redux 和渲染行为

