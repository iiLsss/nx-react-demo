import styles from './abccomp.module.less'

/* eslint-disable-next-line */
export interface AbccompProps {}

export function Abccomp(props: AbccompProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Abccomp!</h1>
    </div>
  )
}

export default Abccomp
