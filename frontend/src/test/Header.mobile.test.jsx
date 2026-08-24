import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import Header from '../components/Header'

// Mock ChurchContext
vi.mock('../context/ChurchContext', () => ({
  useChurch: () => ({
    church: {
      denomination: 'ECC/56è CECC',
      church_name: 'Centre Missionnaire Shimekah',
      logo: null,
      social_links: [],
    },
    loading: false,
    error: null,
  }),
}))

function renderHeader(pathname = '/') {
  return render(
    <MemoryRouter initialEntries={[pathname]}>
      <Header />
    </MemoryRouter>
  )
}

describe('Header — mobile menu', () => {
  it('renders the church name', () => {
    renderHeader()
    expect(screen.getByText('Centre Missionnaire Shimekah')).toBeInTheDocument()
  })

  it('renders the hamburger button with correct aria attributes', () => {
    renderHeader()
    const toggle = screen.getByRole('button', { name: /ouvrir le menu/i })
    expect(toggle).toBeInTheDocument()
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).toHaveAttribute('aria-controls', 'mobile-nav')
  })

  it('opens the menu when hamburger is clicked', async () => {
    const user = userEvent.setup()
    renderHeader()
    const toggle = screen.getByRole('button', { name: /ouvrir le menu/i })

    await user.click(toggle)

    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(toggle).toHaveAttribute('aria-label', 'Fermer le menu')
    expect(screen.getByRole('navigation', { name: /navigation principale/i })).toHaveClass('nav--open')
  })

  it('closes the menu when hamburger is clicked again', async () => {
    const user = userEvent.setup()
    renderHeader()
    const toggle = screen.getByRole('button', { name: /ouvrir le menu/i })

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByRole('navigation', { name: /navigation principale/i })).not.toHaveClass('nav--open')
  })

  it('closes the menu on Escape key', async () => {
    const user = userEvent.setup()
    renderHeader()
    const toggle = screen.getByRole('button', { name: /ouvrir le menu/i })

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')

    await user.keyboard('{Escape}')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).toHaveFocus()
  })

  it('closes the menu when a nav link is clicked', async () => {
    const user = userEvent.setup()
    renderHeader('/')
    const toggle = screen.getByRole('button', { name: /ouvrir le menu/i })

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')

    // Click the "À propos" link (navigates away from /)
    const link = screen.getByRole('link', { name: 'À propos' })
    await user.click(link)

    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })

  it('locks body scroll when menu is open', async () => {
    const user = userEvent.setup()
    renderHeader()
    const toggle = screen.getByRole('button', { name: /ouvrir le menu/i })

    await user.click(toggle)
    expect(document.body.style.overflow).toBe('hidden')

    await user.keyboard('{Escape}')
    expect(document.body.style.overflow).toBe('')
  })

  it('toggles aria-label between ouvrir/fermer', async () => {
    const user = userEvent.setup()
    renderHeader()
    const toggle = screen.getByRole('button', { name: /ouvrir le menu/i })

    await user.click(toggle)
    expect(screen.getByRole('button', { name: /fermer le menu/i })).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.getByRole('button', { name: /ouvrir le menu/i })).toBeInTheDocument()
  })
})
