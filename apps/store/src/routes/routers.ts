import COURSE_ROUTE from './router/course'
import TODO_ROUTE from './router/todo'
import TODO_REDUCER_ROUTE from './router/todoReducer'
import TREE_ROUTE from './router/tree'
import FORM_ROUTE from './router/form'
import type { SiderType } from '@integrated-react-test/common-ui'
// type Route = RouteObject & { title?: string; children?: Route[] }

// type RouterList = {
//   path: string
//   title?: string
//   children?: Route[]
// }

function filterElement(r: SiderType[], base = '') {
  const arr: SiderType[] = []
  r.forEach((item) => {
    const obj: SiderType = {
      path: `${base}/${item.path}`,
      title: item.title,
    }
    if (item.children?.length) {
      obj.children = filterElement(item.children, obj.path)
    }
    arr.push(obj)
  })
  return arr
}

const routers = [
  COURSE_ROUTE,
  TODO_ROUTE,
  TODO_REDUCER_ROUTE,
  TREE_ROUTE,
  FORM_ROUTE,
]

export const routerList: SiderType[] = [
  { path: '/', title: '首页' },
  ...filterElement(routers),
]
export default routers
