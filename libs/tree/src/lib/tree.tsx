import styles from './tree.module.less'

/* eslint-disable-next-line */
export interface TreeProps {}

export function Tree(props: TreeProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Tree!</h1>
    </div>
  )
}

export default Tree
