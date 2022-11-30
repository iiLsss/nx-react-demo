// import React from 'react'
import { useAppSelector } from '../../store'
const Index = () => {
  const { username, avatar } = useAppSelector((state) => state.user)

  return (
    <div className="wrap">
      <img src={avatar} alt="" />
      <p>用户名：{username}</p>
    </div>
  )
}
export default Index
