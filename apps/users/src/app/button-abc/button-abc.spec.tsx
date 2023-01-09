import { render } from '@testing-library/react'

import ButtonABC from './button-abc'

describe('ButtonABC', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ButtonABC />)
    expect(baseElement).toBeTruthy()
  })
})
