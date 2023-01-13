import React from 'react'
import { useAppSelector } from '../../store'
import { store } from '../../store/index'

const NotAuth = () => {
  return <div>没权限</div>
}
console.log(NotAuth)

type Props = {
  permissionId: string // 权限id
  emptyComp?: React.ReactNode // emptyComp 没权限时的显示
  children: React.ReactNode | React.ReactNode[]
}

const Index: React.FC<Props> = (props) => {
  const { permissionIds, isAdmin } = useAppSelector((state) => state.user)

  const { permissionId, emptyComp = '' } = props
  if (isAdmin) {
    return <>props.children</>
  }
  // 单个权限
  if (!Array.isArray(permissionId)) {
    const haveAuth = isAdmin || permissionIds.includes(permissionId)
    return haveAuth ? <>{props.children}</> : <>emptyComp</>
  }
  // 多个权限传数组
  // permissionId
  return (
    <>
      {(props.children as React.ReactNode[]).map((item, index) => {
        const haveAuth = permissionIds.includes(permissionId[index])
        return (
          <React.Fragment key={index}>
            {haveAuth ? item : emptyComp}
          </React.Fragment>
        )
      })}
    </>
  )
}

// 判断权限是否存在 直接调用
type HaveAuth = (permissionId: string) => boolean

export const haveAuth: HaveAuth = (permissionId) => {
  const { user } = store.getState()
  const { permissionIds, isAdmin } = user
  return !!isAdmin || permissionIds.includes(permissionId)
}

export default Index
