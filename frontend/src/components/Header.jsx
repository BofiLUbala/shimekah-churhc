import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useChurch } from '../context/ChurchContext'
import SocialIcon from './SocialIcon'

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

export default function Header() {
  const { church } = useChurch()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`header ${scrolled || open ? 'header--scrolled' : ''}`}>
      <div className="container header__inner">
        <Link to="/" className="header__brand">
          {church?.logo && <img src={church.logo} alt="Logo" className="header__logo" />}
          <span className="header__brand-text">
            <span className="header__denomination">{church?.denomination}</span>
            <span className="header__name">{church?.church_name || 'Centre Missionnaire Shimekah'}</span>
          </span>
        </Link>

        <nav className={`nav ${open ? 'nav--open' : ''}`} aria-label="Navigation principale">
          <ul className="nav__list">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`}
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
          type="button"
          className={`nav-toggle ${open ? 'is-open' : ''}`}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Ouvrir le menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}
