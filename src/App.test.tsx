import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

function App() {
  return <div>Hello World</div>
}

describe('App', () => {
  it('renders hello world message', () => {
    render(<App />)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })
})