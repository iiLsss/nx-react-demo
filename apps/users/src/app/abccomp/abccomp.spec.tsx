import { render } from '@testing-library/react'

import Abccomp from './abccomp'

describe('Abccomp', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Abccomp />)
    expect(baseElement).toBeTruthy()
  })
})
