import { Button as AButton, ButtonProps as AButtonProps } from 'antd'
export type ButtonProps = AButtonProps

export const Button = (props: ButtonProps) => {
  return <AButton {...props}></AButton>
}

export default Button
