import styles from './space.module.less'

/* eslint-disable-next-line */
export interface SpaceProps {}

export function Space(props: SpaceProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Space!</h1>
    </div>
  )
}

export default Space
