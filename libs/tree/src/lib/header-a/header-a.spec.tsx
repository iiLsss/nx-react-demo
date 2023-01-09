import { render } from '@testing-library/react'

import HeaderA from './header-a'

describe('HeaderA', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<HeaderA />)
    expect(baseElement).toBeTruthy()
  })
})
