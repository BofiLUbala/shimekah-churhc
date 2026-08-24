import { useChurch } from '../context/ChurchContext'
import SocialIcon from '../components/SocialIcon'

export default function HeroSection() {
  const { church, loading } = useChurch()
  const socials = church?.social_links || []

  return (
    <section className="hero">
      <div className="hero__overlay" aria-hidden="true" />
      {church?.hero_image && (
        <img src={church.hero_image} alt="" className="hero__background" aria-hidden="true" />
      )}
      <div className="container hero__content">
        <p className="hero__denomination">{church?.denomination || 'ECC/56è CECC'}</p>
        <h1 className="hero__title">
          {loading ? 'Chargement…' : church?.church_name || 'Centre Missionnaire Shimekah'}
        </h1>
        <p className="hero__slogan">Retour à la foi authentique</p>
        {church?.founded_date && (
          <p className="hero__since">
            Depuis le{' '}
            {new Date(church.founded_date).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        )}
        <div className="hero__actions">
          <a href="#mission" className="btn btn--primary btn--lg">
            Découvrir notre mission
          </a>
          <a href="#structures" className="btn btn--ghost btn--lg">
            Nos programmes
          </a>
        </div>
        <div className="hero__social">
          {socials.map((link) => (
            <SocialIcon key={link.id} name={link.icon_name} url={link.url} label={link.platform} />
          ))}
        </div>
      </div>
    </section>
  )
}
