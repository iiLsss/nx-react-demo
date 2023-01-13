import { List } from 'antd'

type Props = {
  a?: string
}

const Index: React.FC<Props> = (props) => {
  console.log(props)
  return (
    <div>
      <List />
    </div>
  )
}

export default Index
