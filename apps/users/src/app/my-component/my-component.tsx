import styles from './my-component.module.less'

/* eslint-disable-next-line */
export interface MyComponentProps {}

export function MyComponent(props: MyComponentProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to MyComponent!</h1>
    </div>
  )
}

export default MyComponent
