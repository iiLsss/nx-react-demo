import styles from './header-a.module.less'

/* eslint-disable-next-line */
export interface HeaderAProps {}

export function HeaderA(props: HeaderAProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to HeaderA!</h1>
    </div>
  )
}

export default HeaderA
