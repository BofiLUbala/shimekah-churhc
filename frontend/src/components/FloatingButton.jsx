import { useEffect, useState } from 'react'
import { useChurch } from '../context/ChurchContext'
import defaultLogo from '../assets/logo.png'

export default function FloatingButton() {
  const { church } = useChurch()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 200)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      type="button"
      className={`floating-btn ${scrolled ? 'floating-btn--scrolled' : ''}`}
      onClick={handleClick}
      aria-label="Retour en haut — Centre Missionnaire Shimekah"
      title="Centre Missionnaire Shimekah — Retour en haut"
    >
      <img
        src={church?.logo || defaultLogo}
        alt="Logo Centre Missionnaire Shimekah"
        className="floating-btn__logo"
      />
      <span className="floating-btn__badge" aria-hidden="true">
        ↑
      </span>
    </button>
  )
}
