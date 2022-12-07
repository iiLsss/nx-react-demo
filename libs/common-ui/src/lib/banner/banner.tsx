import classnames from 'classnames/bind'
import style from './banner.module.less'
const cx = classnames.bind(style)

export interface BannerProps {
  text?: string
}
export function Banner(props: BannerProps) {
  return (
    <header className={cx('header')}>
      <div>{props.text}</div>
    </header>
  )
}

export default Banner
