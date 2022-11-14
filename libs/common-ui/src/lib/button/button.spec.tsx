import { render } from '@testing-library/react'

import Button from './button'

describe('Banner', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Button />)
    expect(baseElement).toBeTruthy()
  })
})
