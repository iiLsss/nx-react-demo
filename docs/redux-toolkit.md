# redux-toolkit

## 用 Immer 编写 Reducers

Redux Toolkit 的 createReducer 和 createSlice 在内部自动使用 Immer，让您使用“变异”语法编写更简单的不可变更新逻辑。 这有助于简化大多数 reducer 的实现。

因为 Immer 本身就是一个抽象层，所以了解 Redux Toolkit 为什么使用 Immer 以及如何正确使用它很重要。



### 不变性基础知识

“可变”意味着“可变”。如果某物是“不可变的”，它就永远无法改变。

默认情况下，JavaScript 对象和数组都是可变的。如果我创建一个对象，我可以更改其字段的内容。如果我创建一个数组，我也可以更改内容：

```js
const obj = { a: 1, b: 2 }
// still the same object outside, but the contents have changed
obj.b = 3

const arr = ['a', 'b']
// In the same way, we can change the contents of this array
arr.push('c')
arr[1] = 'd'
```

这称为改变对象或数组。还是内存中的同一个对象或者数组引用，但是现在对象里面的内容变了。


**为了不可变地更新值，您的代码必须复制现有对象/数组，然后修改副本。**

我们可以使用 JavaScript 的数组/对象扩展运算符以及返回数组新副本而不是改变原始数组的数组方法来手动完成此操作：

```js

const obj = {
  a: {
    // To safely update obj.a.c, we have to copy each piece
    c: 3,
  },
  b: 2,
}

const obj2 = {
  // copy obj
  ...obj,
  // overwrite a
  a: {
    // copy obj.a
    ...obj.a,
    // overwrite c
    c: 42,
  },
}

const arr = ['a', 'b']
// Create a new copy of arr, with "c" appended to the end
const arr2 = arr.concat('c')

// or, we can make a copy of the original array:
const arr3 = arr.slice()
// and mutate the copy:
arr3.push('c')
```


## reducers和不可变更新

Redux 的主要规则之一是**我们的 reducer 永远不允许改变原始/当前状态值！**

```js
// ❌ 非法的 - 默认情况下，这会改变状态！
state.value = 123
```

你不能在 Redux 中改变状态有几个原因：

1. 它会导致错误，例如 UI 无法正确更新以显示最新值
2. 这使得理解状态更新的原因和方式变得更加困难
3. 这使得编写测试变得更加困难
4. 它打破了正确使用“时间旅行调试”的能力
5. 它违背了 Redux 的预期精神和使用模式

因此，如果我们不能更改原始状态，我们如何返回更新后的状态?

Reducers 只能复制原始值，然后它们可以改变副本。

```js
// ✅ 这是安全的，因为我们做了一个副本
return {
  ...state,
  value: 123,
}
```

我们已经看到我们可以通过使用 JavaScript 的数组/对象扩展运算符和其他返回原始值副本的函数来手动编写不可变更新。

当数据嵌套时，这会变得更难。不可变更新的一个关键规则是您必须为需要更新的每一层嵌套制作一个副本。
一个典型的例子可能是这样的：

```js
function handwrittenReducer(state, action) {
  return {
    ...state,
    first: {
      ...state.first,
      second: {
        ...state.first.second,
        [action.someId]: {
          ...state.first.second[action.someId],
          fourth: action.someValue,
        },
      },
    },
  }
}
```

但是，如果您认为“以这种方式手动编写不可变更新看起来很难记住并正确执行”……是的，您是对的！ :)

手动编写不可变的更新逻辑很困难，不小心改变 reducer 中的状态是 Redux 用户最常犯的错误。


## 使用 Immer 进行不可变更新

Immer 是一个库，它简化了编写不可变更新逻辑的过程。

Immer 提供了一个名为 `produce` 的函数，它接受两个参数：您的原始`state`和一个回调函数。 回调函数被赋予该状态的“草稿”版本，并且在回调内部，编写改变草稿值的代码是安全的。 Immer 跟踪所有改变草稿值的尝试，然后使用不可变的等价物重播这些突变，以创建安全的、不可变的更新结果：

```js

import produce from 'immer'

const baseState = [
  {
    todo: 'Learn typescript',
    done: true,
  },
  {
    todo: 'Try immer',
    done: false,
  },
]

const nextState = produce(baseState, (draftState) => {
  // “改变”草案数组
  draftState.push({ todo: 'Tweet about it' })
  // “改变”嵌套状态
  draftState[1].done = true
})

console.log(baseState === nextState)
// false - 数组被复制
console.log(baseState[0] === nextState[0])
// true - 第一项没有改变，所以相同的参考
console.log(baseState[1] === nextState[1])
// false - 第二项已复制并更新
```

### Redux Toolkit and Immer

Redux Toolkit 的 createReducer API 在内部自动使用 Immer。因此，在传递给 createReducer 的任何 case reducer 函数中“改变”状态已经是安全的：

```js
const todosReducer = createReducer([], (builder) => {
  builder.addCase('todos/todoAdded', (state, action) => {
    // "mutate" the array by calling push()
    state.push(action.payload)
  })
})
```

反过来，createSlice 在内部使用 createReducer，因此在那里“改变”状态也是安全的：

```js
const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    todoAdded(state, action) {
      state.push(action.payload)
    },
  },
})
```

如果 case reducer 函数是在 createSlice/createReducer 调用之外定义的，这甚至适用。例如，您可以有一个可重用的 case reducer 函数，它期望“改变”它的状态，并根据需要包含它：

```js
const addItemToArray = (state, action) => {
  state.push(action.payload)
}

const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    todoAdded: addItemToArray,
  },
})
```
这是有效的，因为“变异”逻辑在执行时在内部包装在 Immer 的 produce 方法中。


请记住，“变异”逻辑只有在包裹在 Immer 内部时才能正常工作！否则，该代码将真正改变数据。


## Immer 使用模式

在 Redux Toolkit 中使用 Immer 时，有几个有用的模式需要了解和注意。

### 变异和返回状态 Mutating and Returning State​

Immer 的工作方式是跟踪改变现有起草状态值的尝试，方法是分配给嵌套字段或调用改变值的函数。 这意味着状态必须是 JS 对象或数组，以便 Immer 看到尝试的更改。 （你仍然可以让切片的状态是原始值，如字符串或布尔值，但由于原始值永远不会发生变化，你所能做的就是返回一个新值。）


在任何给定的 case reducer 中，**Immer 希望您要么改变现有状态，要么自己构造一个新的状态值并返回它，但不能在同一个函数中**例如，这两个都是 Immer 的有效减速器：

```js
const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    todoAdded(state, action) {
      // “变异”现有状态，不需要返回值
      state.push(action.payload)
    },
    todoDeleted(state, action.payload) {
      // 不可变地构造一个新的结果数组并返回它
      return state.filter(todo => todo.id !== action.payload)
    }
  }
})
```

但是，可以使用不可变更新来完成部分工作，然后通过“突变”保存结果。这方面的一个例子可能是过滤嵌套数组：

```js
const todosSlice = createSlice({
  name: 'todos',
  initialState: {todos: [], status: 'idle'}
  reducers: {
    todoDeleted(state, action.payload) {
      // 不可变地构造一个新数组
      const newTodos = state.todos.filter(todo => todo.id !== action.payload)
      // 变异”现有状态以保存新数组
      state.todos = newTodos
    }
  }
})
```

请注意，在带有隐式返回值的箭头函数中改变状态会破坏此规则并导致错误！ 这是因为语句和函数调用可能会返回一个值，而 Immer 会同时看到尝试的突变和新的返回值，但不知道使用哪个作为结果。 一些潜在的解决方案是使用 void 关键字来跳过返回值，或者使用花括号为箭头函数提供一个主体并且没有返回值：

```js
const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    // ❌ ERROR: 改变状态，但也返回新的数组大小！
    brokenReducer: (state, action) => state.push(action.payload),
    // ✅ SAFE: `void` 关键字阻止返回值
    fixedReducer1: (state, action) => void state.push(action.payload),
    // ✅ SAFE: 花括号使它成为一个函数体并且没有返回
    fixedReducer2: (state, action) => {
      state.push(action.payload)
    },
  },
})
```

虽然编写嵌套的不可变更新逻辑很困难，但有时执行对象解构操作以一次更新多个字段比分配单个字段更简单

```js
function objectCaseReducer1(state, action) {
  const { a, b, c, d } = action.payload
  return {
    ...state,
    a,
    b,
    c,
    d,
  }
}

function objectCaseReducer2(state, action) {
  const { a, b, c, d } = action.payload
  // This works, but we keep having to repeat `state.x =`
  state.a = a
  state.b = b
  state.c = c
  state.d = d
}
```

作为替代方案，您可以使用 Object.assign 一次改变多个字段，因为 Object.assign 总是改变它给定的第一个对象
```js
function objectCaseReducer3(state, action) {
  const { a, b, c, d } = action.payload
  Object.assign(state, { a, b, c, d })
}
```

### 重置和更换State

有时您可能想要替换整个现有状态，因为您已经加载了一些新数据，或者您想要将状态重置回其初始值。

一个常见的错误是尝试直接分配 state = someValue 。 这行不通！ 这只会将本地状态变量指向不同的引用。 这既不是改变内存中现有的状态对象/数组，也不是返回一个全新的值，所以 Immer 没有做任何实际的改变。

Instead, to replace the existing state, you should return the new value directly:
相反，要替换现有状态，您应该直接返回新值：

```js
Instead, to replace the existing state, you should return the new value directly:

const initialState = []
const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    brokenTodosLoadedReducer(state, action) {
      // ❌ ERROR: 实际上并没有改变或返回任何新的东西！
      state = action.payload
    },
    fixedTodosLoadedReducer(state, action) {
      // ✅ CORRECT: 返回一个新值替换旧值
      return action.payload
    },
    correctResetTodosReducer(state, action) {
      // ✅ CORRECT: 返回一个新值来替换旧值
      return initialState
    },
  },
})
```

### Debugging and Inspecting Drafted State调试和检查草稿状态

人们通常希望从 reducer 中记录正在进行的状态，以查看它在更新时的样子，例如 `console.log(state)`。不幸的是，浏览器以一种难以阅读或理解的格式显示记录的 Proxy 实例：

![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAkwAAABWCAMAAAAKaDklAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURSEhITo6O0xNT01OT1ZWVlpcXlxdX15eXmJiY2lqamlqbW1ub3JycnR0dnl5enh5ew0iqig7sxwAzzxOu0Is105ewVZD2lxrxmRT3XBh4HWDzogTkZQunp1Cp6VTr6thtbFuu4Z75Ld7wYCAgICChYWFhYeJi4mJi4mKioqKi4uNkY6PkI+QkJCSk5SVlpOVmJSXm5manJianZueoZ6foZ6hpaSlqKSmqqSnq6mrrquusq+xtK+xta+ytrW4u7a5vYGO05mR6Jah2ryHx6Kb6bq+w7W+5by5777Bxr/H6LPL97TL98GRzMac0Mun1s+x2tO638LFycLGy8TIzcvQ1c7S19DU2tLW3NXZ3szM8sjQ68DU98fY+cze9c/e+tjE49zN59zO6N3f9dzh593h6N7j6d/k6tvh8tvm+Nrm++Tg8OPp9eTp8Obq8eXo9+Hr/Ojo9Ovx/ezx+PD1/fL2/vX4/v/w8Pv8//7+/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH3YsoAAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTnU1rJkAAANB0lEQVR4Xu2djVscVxWHicSSLo0lIRXDR0lgExOtxOKiFsRUDBttRCEBYogaLJAPWNJ0rTV/vud3zrmzd2bu7M7C4HNjz/s8yczcuVyYnXfPOTNzYQfahlERJpNRGSaTURkmk1EZJpNRGQGZWnM3tmRtaXZJVoT927f3eTE725AWZUO2czuWZmd1KO3Rmst+6enYPDewqqtVUR+otXSVSG/9H9HnYaY7vHz64AvmwdOX2sTkZdq69ZkasHXrli/Txu1fskyNDdLG39H4dA6GoLE15+1You4b6t9P0WPrRkrOFK3awMDAuU3dKsfe4AIvD4brx7yS4cmVy5fv6XqaxfN3dC3DwuCergl7g0FbF88Ti7qR5mhsZGTsSDfa7Z3RHV3rznEdQw4f6GaK5sjISFPXifFxXekOj3hhW7fSlDzMDn6Hl2KS4NuUk6nV2N9QmRpLDe/k7zdasENYmuuIurHUYpnYG5GHYbHELhoIPfzhsvBPmz3GHqzq26VApidX7rfvX3miWz4H9V+E9WvVMi9qrkG4Qy5uX3ioWz5HY+lT3Rx9oWu9OK6H7Ww3L6V8PBpb0bXuHAzTz3cnaFPZw+zgd3iqHjFPtRGEaiaVibyQs7/hsl1WpqXZDd5SmdC2dUtTJFqxt0G7qBEy7X+S7Muz+T2KSqv9haaFuq4EeX2VohL/l2Nx8WFYpr33Mj9AroHh834wHDr5Ox+l5SkZRgg++SHG0/KUjXXbw+RR+IcseZgefgfJcf/4z9dYPNBGUCwTXCiSSdNcWqatG7TV0KgGGmTX1g3aRcNApq1PfpsUUcTPPhB+zFurCEoUmVq1hYWBAVhSp7xHb4c67WjVBvfq3ObrQ12xeHje5azVAUl7wv0fftlu3wvluYMPtx9yQsG40qTwT+Gz+V4oVvJ558iUG2FFUhyS3QgFpSSMIFUhSL0YTWVBDz75RPoo8BWS4jDCCI3mYh1/C4y+QksvCzr4EFmmkx6mh9+BXUrQRlAsE4JPJi8lMjU6yQyITCTd7OxnnchEzbOzc582OPWxTBCrE932fiAy/ZW3EGVWSZ5W7ft1hKlWjRqQ9ug9IeuU01yRJMi75eDX8rIR6dNw7zolut9dva+bHot39MzlXuVcrAu/ytsfHtBpgsLpEWAKMXb0YpQCErxyJrhwsnOpWZSnwkcBU4hme4WSHY+muiYxb5y2Q8l0EcE3LFPJw/TIyvTq7dtv2KVSMnFOKpDJDz9AZQJezcRQzcTpTiIT7du/LdGMuMsu/UY2EIdwyHuDJA3JBHc09/0cLvG7yX9HbZ5LNvhly3H93vWrr7/8Ub5mosAksSVLPRMTwCpHyQwUDM+fDyYlFYVPOM62k0jrHt79YjQoU/goXCRij3g0lcgVZ7x7JSDTHSS4UGFX+jB9vA4i0at//42X2ggKZUKYIVLaqExLGZd8mVAi+VC5tHVDhtpgP/3CCYlOkhy9ebTA2zzHK5LC+P3QqnGdzREq9SrU3Ra/bFleX71MQYlzXQYKTGGZAm/QVF5NwAhhXnwEadQZL4wgwsCtSwgzQZcK6+8Vlkac8WIdrYzA0HGMGHBJjnAxdH1Y9jA9/A7s0Bdf9RGZmGDNtKGVEm2naiYg+W//thshuRkgV3P0n38diEQnSU5iENDgI97USSPKcQvwi3RzV2+KC9ZhMQrr74NhxJXghX2uDs01MIXnPRVGkJf8+hsBKVuee4SPIhXrOHn69TcCUqY8T+BEvn3hFIfpkeogEn39lSy1EeRlakgYkXVPJlRAiFS4NakdRCaJPHOtzh1JlYmCW6Ily8RFlO/D3Q/u6lqSwJwh8GiBLu5QL8k7qf6TWvoN5SITpa3jX1GKyFSu9ygoUaKjtYXUrU0JK7i4z9US+o1qe7W6lGfuPZweoXPecyNIJIIAKxwuINPncvZhGEomgdO5T4/6myylUETiQKadz3kXfzeUTEL6h0QJtn0hX9cRJQ8z0IERif71SpbaCEKR6X+IFkx0GPrSJplsb5BrqFXcet0bhGHpI0VX3T6uy725TAfKc5fZJdrhnR+tIiBT7oRy6KO0mryILhamRkjOe2AEjUR05TX2R0Qhvd/IZTRCiLsko69MnWG+Cxo6CheJcO3WRBTSm6Jc60NXd92Y/SExotxkOuFhhjowcmvgm7dvoVOvWwORks3rSWbsSenbV7nSwTWUHeFozEWeXvAVahmaSeTpxRkeZuor+rppGSfIeym0VO+NBLYyZL+H+xalRwhdVYVBCi9DwaVfgDM8zPRLXf5xSpy0aoFL14VyT2FDV8IFUG71XrVkq+wI46GrqiDefY2u0NVfWZfO7jDT3YnyD3oN44SYTEZlmExGZZhMRmWYTEZlmExGZcQr0+7kxMQaLd9MT0xMv5G2k7E+MTGxTks3onFGxCvTuhp0+PEuFjMz9N/61CHW82Dv7hR3DKFjkJiQqhfzQ0M3MRtkeWjo4nNpMsoQr0xrsIfY/RgCvZlGTFkrCFG8t9C0zq4uvqVYZpna7UcmUz9EK5PYQ4hAh1OIKRyeAnDkKdpJOAm7+JbCZDoR0cok9hDiCMcUCUBUAVHpszb9l4kJuIGaCiuJfSiNOOs9oz0yyIwTk8fKPEVfnqd8Nq/mzNOKyXRCopVJshtcYR9YoYnJ3fYa/YNoayQQlodTJAgij7NvXTvsTqEXh6SkVBKpsjKRSY/ff2QynZpoZcrU32wFZSlWBmFqhoIRS4UdXv0tHSbXST8yR2TqXn/DnOObyybTqYlWpoL6m6seWnID7eMlCyTeaAjDdqc+clHOSZXGZKqKaGVyZY5EKNYFAQjKILOxF7RPPKLM5upvF9H8elw9Q2TjZRqTqSpilUnsITL1N2c6SmDsBe3jNtRS3PH3u1wyAT+lOa9UqmzNpDI9vviY6ydtAiZTX8Qqk7sjJPlN3IFguHZbp6gFL3gfpbXpZ0hj7j73mqQ5NwCRqb+LZMLNyvnl+fbzi0PExefHN7F8/7F2M3oSq0yZ+vtUdK+/jcqIVaZ0/X06utffRmXEKtOMPt2l5KVF0AlJnhPTiMH626iMWGUy3kFMJqMyTCajMkwmozJMJqMyTCajMuKV6fRzwN3NAHdv3Dhj4pUpfQ+cp8D1fc+pr/voeIyyjBU3B9zok3hlyt0D9562dcdNEug84Q1PF8jBT+iAe9Br9EW0MukTXk+NkkYkz3NDY3THZDod0cqUmYNCqBE8+22N4pRO8XZzwHm6AKbxYj8mgXvZTfRK/4G/45t/uDk09MibNWAynZJoZXLZrfOoX4xwc8DdFO9kDvgM/ePg1UmHmTGyMpFJyxefm0yVEa1MudpZQhX/D13cFG+OVxS92COeqpvMtexef7M5PCHOZKqIaGUqqL/FGZJEp3hzWQTDZpDcuC3Ji93nsZhMlROtTK6KTuKM1N/wiDObKsORCqkvX3V31jh6ZTGZKidWmSSpEZn6m5TiOeCulIIw+BU6LpmSFiE7RrZmUpkw0Xue7zCZTKcjVplcFd1RQ4xwc8CTKhtzwP9EIiUXdZ0b3tkavkAmzPVenl9uP8KU76HOHHDtZ5QmVpn6uXfdES5NP2MYFRCrTGXngEMY99tNWaqcR26UIFaZys4BR3YLdqjub4UZZYlVJuMdxGQyKsNkMirDZDIqw2QyKsNkMiojXpnO7to+GdF+Y7xa4pUpc/8abumcNwHTBLqqEHy8q43ufmbyGNmogHhlKpiD4sAzFJ4+UEgyj8DHPeHTfclj5BTeR34bfRCtTMn5TgKMzEFxcMAKuyAE/xqTNrr5BAVP9UymkxGtTEVzUHhSAGmFgCUuUL6b3JW4xf+hA33N7tSfJ+VJi3TgpT56cdFOU2j6A7vH8QHf+IDUlfHmyAh5hQ98x4fL40NOS3/K6XeRaGVy57sTYMQql+ygFv5885tpaqYNlg/BC1Mw5U83T+7CNtfhzTR9hUY3VyrpN8l++rtGphUy6sVoM5Fp51Kzj89f/g4SrUy5+SOaktwUAYQZdOF4NaN/y5l8Y9mwgemX6Ow6sEe8QQuNdgX1t5OJohMkcjKtoBkbRphoZSqsv9c4ibEupALPiWOrqN6GeKwLwtnMtWnpqB0Q2FTIpDZ33ySDk0m9cTJJ/jOZColWJne+k+DRqb8Pp3AhJ39Qt5MFSYw1+hqWiSISdUCySzqwR+syBbNH/V0kE0cmo5hYZSqsv4mOSFoRMbvXnl0Tj6hkknm9KJ+SDkiBkzqfV4Oc+ybZmgn5DQuVqUmb41R5o2YyuhCrTO58a/BIkhX/lW/EGKgFv/g3eLFxOCW2oZgiRxDIuOZ2HcikqX9KAZapv3MyHY3J1ZzKhM2Vcb2as8u5YmKVKVd/V0mP+ts4IbHKlKu/q6RH/W2ckFhlomTFYaPXHPD+cb8J5R4kG5URq0zGO4jJZFSGyWRUhslkVMbA3w2jIga+NYyKMJmMivj22/8CcbWPrEwB1g4AAAAASUVORK5CYII=)


`https://immerjs.github.io/immer/current/`
为了解决这个问题，Immer 包含一个`current`函数，用于提取包装数据的副本，RTK 重新导出`current`。如果你需要记录或检查正在进行的工作状态，你可以在你的reducer中使用它

```js
import { current } from '@reduxjs/toolkit'

const todosSlice = createSlice({
  name: 'todos',
  initialState: todosAdapter.getInitialState(),
  reducers: {
    todoToggled(state, action) {
      // ❌ ERROR: 记录代理包装的数据
      console.log(state)
      // ✅ CORRECT: logs a plain JS copy of the current data
      console.log(current(state))
    },
  },
})
```

正确的输出应该是这样的：

![](data:image/png;base64,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)

Immer 还提供了 [original 和 isDraft](https://immerjs.github.io/immer/original) 函数，它们可以在不应用任何更新的情况下检索原始数据，并检查给定值是否是 Proxy-wrapped 草稿。从 RTK 1.5.1 开始，这两者也从 RTK 重新导出。

### 更新嵌套数据

Immer 大大简化了嵌套数据的更新。嵌套对象和数组也被包裹在 Proxies 中并起草，并且将嵌套值拉出到其自己的变量中然后对其进行变异是安全的。
但是，这仍然只适用于对象和数组。如果我们将一个原始值提取到它自己的变量中并尝试更新它，Immer 没有任何东西可以包装并且无法跟踪任何更新：
```js
const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    brokenTodoToggled(state, action) {
      const todo = state.find((todo) => todo.id === action.payload)
      if (todo) {
        // ❌ ERROR: Immer 无法跟踪原始值的更新！
        let { completed } = todo
        completed = !completed
      }
    },
    fixedTodoToggled(state, action) {
      const todo = state.find((todo) => todo.id === action.payload)
      if (todo) {
        // ✅ CORRECT: 这个对象仍然包裹在代理中，所以我们可以“改变”它
        todo.completed = !todo.completed
      }
    },
  },
})
```

这里有一个问题。 Immer 不会包装新插入状态的对象。大多数时候这无关紧要，但有时您可能想要插入一个值然后对其进行进一步更新。

与此相关，RTK 的 createEntityAdapter 更新函数既可以用作独立的reducer，也可以用作“变异”更新函数。 这些函数通过检查给定的状态是否包含在草稿中来确定是“改变”还是返回新值。 如果您在 case reducer 中自己调用这些函数，请确保您知道传递给它们的是草稿值还是普通值。

最后，值得注意的是，Immer 不会自动为您创建嵌套对象或数组——您必须自己创建它们。 例如，假设我们有一个包含嵌套数组的查找表，我们想要将一个项目插入到其中一个数组中。 如果我们在不检查该数组是否存在的情况下无条件地尝试插入，则当数组不存在时逻辑将崩溃。 相反，您需要先确保数组存在：

```js
const itemsSlice = createSlice({
  name: 'items',
  initialState: { a: [], b: [] },
  reducers: {
    brokenNestedItemAdded(state, action) {
      const { id, item } = action.payload
      // ❌ ERROR: 如果 `id` 不存在数组，将会崩溃
      state[id].push(item)
    },
    fixedNestedItemAdded(state, action) {
      const { id, item } = action.payload
      // ✅ CORRECT: 确保嵌套数组总是首先存在
      if (!state[id]) state[id] = []
      state[id].push(item)
    },
  },
})
```

许多 ESLint 配置包括 https://eslint.org/docs/rules/no-param-reassign 规则，该规则也可能警告嵌套字段的突变。 这可能会导致规则警告 Immer 驱动的减速器中的状态突变，这没有帮助。

要解决此问题，您可以告诉 ESLint 规则忽略对名为 state 的参数的更改：

```js
{
  'no-param-reassign': ['error', { props: true, ignorePropertyModificationsFor: ['state'] }]
}
```


## 为什么内置 Immer

随着时间的推移，我们收到了许多请求，要求将 Immer 设为 RTK 的 createSlice 和 createReducer API 的可选部分，而不是严格要求的部分。

我们的答案始终如一：RTK 需要 Immer，这一点不会改变。 值得一提的是，为什么我们认为 Immer 是 RTK 的关键部分，以及为什么我们不会将其设为可选。

### Immer的好处

Immer 有两个主要优点。 首先，Immer 极大地简化了不可变的更新逻辑。 适当的不可变更新非常冗长。 那些冗长的操作很难从整体上阅读，也混淆了更新语句的实际意图。 Immer 消除了所有嵌套的展开和数组切片。 不仅代码更短、更易于阅读，而且实际更新应该发生的内容也更加清晰。

其次，正确编写不可变更新很难，而且很容易出错（比如忘记复制一组对象传播中的嵌套级别，复制顶级数组而不是数组中要更新的项目， 或者忘记 array.sort() 改变数组）。 这就是为什么意外突变一直是 Redux 错误的最常见原因的部分原因。 Immer 有效地消除了意外突变。 不仅没有更多可能被误写的传播操作，而且 Immer 还会自动冻结状态。 如果您不小心发生变异，即使在 reducer 之外，也会引发错误。 消除 Redux 错误的第一大原因是一个巨大的改进。

此外，RTK 查询还使用 Immer 的补丁功能来启用乐观更新和手动缓存更新

### 权衡和担忧

与任何工具一样，使用 Immer 确实需要权衡取舍，并且用户对使用它表示了很多担忧。

Immer 确实增加了整个应用程序包的大小。 大约 8K min，3.3K min+gz（参考：Immer 文档：安装，Bundle.js.org 分析）。 但是，该库包大小开始通过缩减应用程序中的 reducer 逻辑量来收回成本。 此外，更可读的代码和消除突变错误的好处是值得的。

Immer 还增加了一些运行时性能开销。 但是，根据 Immer“性能”文档页面，开销在实践中没有意义。 此外，无论如何，reducer 几乎从来都不是 Redux 应用程序中的性能瓶颈。 相反，更新 UI 的成本要重要得多。

因此，虽然使用 Immer 并非“免费”，但捆绑和性能成本足够小，值得

使用 Immer 最现实的痛点是浏览器调试器以一种令人困惑的方式显示代理，这使得在调试时很难检查状态变量。 这当然是一个烦恼。 但是，这实际上并不影响运行时行为，我们已经在本页中记录了使用 current 创建数据的可查看纯 JS 版本。 （鉴于越来越广泛地使用代理作为库的一部分，如 Mobx 和 Vue 3，这也不是 Immer 独有的。）

另一个问题是教育和理解。 Redux 一直要求 reducer 的不变性，因此看到“变化”的代码可能会令人困惑。 新的 Redux 用户肯定有可能在示例代码中看到这些“突变”，假设 Redux 的使用是正常的，然后尝试在 createSlice 之外做同样的事情。 这确实会导致真正的突变和错误，因为它超出了 Immer 包装更新的能力。

我们通过在整个文档中反复强调不变性的重要性来解决这个问题，包括多个突出显示的部分，强调“突变”只有在 Immer 内部的“魔法”下才能正常工作，并添加了您现在正在阅读的这个特定文档页面。

### 架构和意图

Immer 不是可选的还有两个原因。

一是RTK的架构。 createSlice和createReducer是直接导入Immer实现的。 没有简单的方法来创建其中任何一个具有假设的 immer: false 选项的版本。 您不能进行可选导入，我们需要在应用程序初始加载期间立即同步使用 Immer。

此外，RTK 目前在导入时立即调用 Immer 的 enableES5 插件，以确保 Immer 在没有 ES6 Proxy 支持的环境（例如 IE11 和较旧的 React Native 版本）中正常工作。 这是必要的，因为 Immer 在 6.0 版左右将 ES5 行为拆分成一个插件，但是放弃 ES5 支持对于 RTK 来说是一个重大的破坏性变化，并且会破坏我们的用户。 因为RTK本身是从入口调用enableES5，所以总是拉入Immer。

最后：Immer 默认内置于 RTK 中，因为我们相信它是我们用户的最佳选择！ 我们希望我们的用户使用 Immer，并将其视为 RTK 的关键不可协商的组成部分。 更简单的 reducer 代码和防止意外突变等巨大好处远远超过相对较小的问题。