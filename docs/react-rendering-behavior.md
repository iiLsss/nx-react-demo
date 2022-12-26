

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