import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useChurch } from '../context/ChurchContext'
import SocialIcon from './SocialIcon'
import defaultLogo from '../assets/logo.png'

const NAV_ITEMS = [
  { to: '/', label: 'Accueil' },
  { to: '/about', label: 'À propos' },
  { to: '/vision', label: 'Vision' },
  { to: '/structures', label: 'Structures' },
  { to: '/leadership', label: 'Leadership' },
  { to: '/media', label: 'Médias' },
  { to: '/news', label: 'Actualités' },
  { to: '/events', label: 'Événements' },
  { to: '/contact', label: 'Contact' },
]

const NAV_ID = 'mobile-nav'

export default function Header() {
  const { church } = useChurch()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const toggleRef = useRef(null)
  const navRef = useRef(null)
  const location = useLocation()

  const close = useCallback(() => setOpen(false), [])

  // Close menu on route change
  useEffect(() => {
    close()
  }, [location.pathname, close])

  // Close on Escape key
  useEffect(() => {
    if (!open) return
    function onKeyDown(e) {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, close])

  // Lock body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Focus trap inside nav when open
  useEffect(() => {
    if (!open) return
    const nav = navRef.current
    if (!nav) return

    function onFocusIn(e) {
      if (!nav.contains(e.target)) {
        const focusable = nav.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
        if (focusable.length > 0) focusable[0].focus()
      }
    }

    document.addEventListener('focusin', onFocusIn)
    return () => document.removeEventListener('focusin', onFocusIn)
  }, [open])

  // Scroll handler for shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`header ${scrolled || open ? 'header--scrolled' : ''}`}>
      <div className="container header__inner">
        <Link to="/" className="header__brand" aria-label="Accueil Centre Missionnaire Shimekah">
          <img
            src={church?.logo || defaultLogo}
            alt="Logo Centre Missionnaire Shimekah"
            className="header__logo"
          />
          <span className="header__brand-text">
            <span className="header__denomination">{church?.denomination || 'ECC/56è CECC'}</span>
            <span className="header__name">{church?.church_name || 'Centre Missionnaire Shimekah'}</span>
          </span>
        </Link>

        {open && (
          <button
            type="button"
            className="nav-backdrop"
            onClick={close}
            tabIndex={-1}
            aria-hidden="true"
          />
        )}

        <nav
          ref={navRef}
          className={`nav ${open ? 'nav--open' : ''}`}
          aria-label="Navigation principale"
          id={NAV_ID}
        >
          <ul className="nav__list">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`}
                  tabIndex={open ? 0 : -1}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="nav__social">
            {(church?.social_links || []).map((link) => (
              <SocialIcon key={link.id} name={link.icon_name} url={link.url} label={link.platform} />
            ))}
          </div>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className={`nav-toggle ${open ? 'is-open' : ''}`}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={NAV_ID}
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}
