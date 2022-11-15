import COURSE_ROUTE from './course'
import { RouteObject } from 'react-router-dom'
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
  {
    path: 'course',
    title: '课程管理',
    children: COURSE_ROUTE,
  },
]

export const routerList: SiderType[] = [
  { path: '/', title: '首页' },
  ...filterElement(routers),
]
export default routers
