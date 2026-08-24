import EmptyState from '../components/EmptyState'
import Loader from '../components/Loader'
import SectionTitle from '../components/SectionTitle'
import { useApi } from '../hooks/useApi'

function LeaderCard({ leader, highlighted }) {
  return (
    <article className={`leader-card card ${highlighted ? 'leader-card--featured' : ''}`}>
      {leader.photo ? (
        <img src={leader.photo} alt={leader.full_name} className="leader-card__photo" />
      ) : (
        <div className="leader-card__photo leader-card__photo--placeholder" aria-hidden="true">
          {leader.full_name
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((word) => word[0])
            .join('')}
        </div>
      )}
      <h3 className="leader-card__name">{leader.full_name}</h3>
      <p className="leader-card__role">{leader.role}</p>
      {leader.short_biography && <p className="leader-card__bio">{leader.short_biography}</p>}
    </article>
  )
}

export default function LeadershipSection() {
  const { data, loading, error } = useApi('/leaders/')
  const leaders = Array.isArray(data) ? data : data?.results || []
  const featured = leaders.find((l) => l.role.toLowerCase().includes('visionnaire'))
  const others = leaders.filter((l) => l !== featured)

  return (
    <section className="section leadership-section" id="leadership">
      <div className="container">
        <SectionTitle
          eyebrow="Leadership"
          title="Les serviteurs de cette œuvre"
          subtitle="Une équipe dévouée au service de la vision du Centre Missionnaire Shimekah."
        />
        {error && (
          <p className="form-feedback form-feedback--error">Impossible de charger le leadership.</p>
        )}
        {loading && !data ? (
          <Loader />
        ) : !error && leaders.length === 0 ? (
          <EmptyState title="Aucun responsable" message="Le leadership sera publié prochainement." />
        ) : (
          <>
            {featured && (
              <div className="leadership-section__featured">
                <LeaderCard leader={featured} highlighted />
              </div>
            )}
            {others.length > 0 && (
              <div className="cards-grid cards-grid--3">
                {others.map((leader) => (
                  <LeaderCard key={leader.id} leader={leader} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
