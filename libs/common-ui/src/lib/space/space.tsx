import styles from './space.module.less'

/* eslint-disable-next-line */
export interface SpaceProps {}

export function Space(props: SpaceProps) {
  return (
    <div className={styles['container']}>
      <p>common-ui 使用公共shared-images 图片</p>
      <img src="./assets/data-monitoring.png" alt="" />
    </div>
  )
}

export default Space
