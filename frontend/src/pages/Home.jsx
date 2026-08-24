import HeroSection from '../sections/HeroSection'
import VisionSection from '../sections/VisionSection'
import StructuresSection from '../sections/StructuresSection'
import LeadershipSection from '../sections/LeadershipSection'
import MediaSection from '../sections/MediaSection'
import NewsSection from '../sections/NewsSection'
import EventsSection from '../sections/EventsSection'
import NewsletterCTA from '../sections/NewsletterCTA'
import SectionTitle from '../components/SectionTitle'
import { useChurch } from '../context/ChurchContext'

function MissionSection() {
  const { church } = useChurch()
  return (
    <section className="section" id="mission">
      <div className="container">
        <SectionTitle
          eyebrow="Notre mission"
          title="Qui sommes-nous ?"
          subtitle={church?.denomination}
        />
        <div className="mission-text">
          <p className="lead">{church?.description}</p>
          {church?.mission_statement && (
            <blockquote className="quote">
              « {church.mission_statement} »
            </blockquote>
          )}
          <p>
            Née le{' '}
            {church?.founded_date &&
              new Date(church.founded_date).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            , l'église {church?.church_name} œuvre pour ramener chaque âme à une foi authentique en
            Jésus-Christ.
          </p>
          <div className="section__more">
            <a href="#vision" className="btn btn--primary">
              Découvrir notre vision
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <MissionSection />
      <VisionSection />
      <StructuresSection />
      <LeadershipSection />
      <MediaSection />
      <NewsSection />
      <EventsSection />
      <NewsletterCTA />
    </>
  )
}
