import { Link } from 'react-router-dom'
import { useChurch } from '../context/ChurchContext'
import NewsletterForm from './NewsletterForm'
import SocialIcon from './SocialIcon'
import defaultLogo from '../assets/logo.png'

const QUICK_LINKS = [
  { to: '/about', label: 'À propos' },
  { to: '/vision', label: 'Notre vision' },
  { to: '/structures', label: 'Nos structures' },
  { to: '/leadership', label: 'Leadership' },
  { to: '/media', label: 'Médias' },
  { to: '/news', label: 'Actualités' },
  { to: '/events', label: 'Événements' },
  { to: '/contact', label: 'Contact' },
]

export default function Footer() {
  const { church } = useChurch()
  const socials = church?.social_links || []

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__col footer__identity">
          <div className="footer__brand-header">
            <img
              src={church?.logo || defaultLogo}
              alt="Logo Centre Missionnaire Shimekah"
              className="footer__logo"
            />
            <div>
              <p className="footer__denomination">{church?.denomination || 'ECC/56è CECC'}</p>
              <h3 className="footer__name">{church?.church_name || 'Centre Missionnaire Shimekah'}</h3>
            </div>
          </div>
          <address className="footer__address">
            {church?.address}
            {church?.location_reference && (
              <>
                <br />
                Réf. : {church.location_reference}
              </>
            )}
          </address>
          <p className="footer__contacts">
            <a href={`tel:${church?.phone_primary}`}>{church?.phone_primary}</a>
            {church?.phone_secondary && (
              <>
                {' · '}
                <a href={`tel:${church?.phone_secondary}`}>{church.phone_secondary}</a>
              </>
            )}
            <br />
            <a href={`mailto:${church?.email}`}>{church?.email}</a>
          </p>
          <div className="footer__social">
            {socials.map((link) => (
              <SocialIcon key={link.id} name={link.icon_name} url={link.url} label={link.platform} />
            ))}
          </div>
        </div>

        <div className="footer__col">
          <h4>Liens rapides</h4>
          <ul className="footer__links">
            {QUICK_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h4>Newsletter</h4>
          <p>Restez informé des activités du Centre Missionnaire Shimekah.</p>
          <NewsletterForm />
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container">
          © {new Date().getFullYear()} {church?.denomination} — {church?.church_name}. Tous droits
          réservés.
        </div>
      </div>
    </footer>
  )
}
