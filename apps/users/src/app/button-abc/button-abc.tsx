import styles from './button-abc.module.less'

/* eslint-disable-next-line */
export interface ButtonABCProps {}

export function ButtonABC(props: ButtonABCProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to ButtonABC!</h1>
    </div>
  )
}

export default ButtonABC
