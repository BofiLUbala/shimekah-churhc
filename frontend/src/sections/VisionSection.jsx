import Loader from '../components/Loader'
import SectionTitle from '../components/SectionTitle'
import { useApi } from '../hooks/useApi'

const GROUPS = [
  {
    category: 'LEADER',
    title: 'Vision du leader',
    icon: '✦',
  },
  {
    category: 'COLLABORATOR',
    title: 'Vision collaboratrice',
    icon: '✧',
  },
]

function VisionGroup({ category, title, icon }) {
  const { data, loading, error } = useApi('/visions/')
  const rawItems = Array.isArray(data) ? data : data?.results || []
  const items = rawItems.filter((item) => item.category === category)

  return (
    <div className="vision-group card">
      <h3 className="vision-group__title">
        <span aria-hidden="true">{icon}</span> {title}
      </h3>
      {error && <p className="form-feedback form-feedback--error">Impossible de charger la vision.</p>}
      {loading && !data ? (
        <Loader />
      ) : items.length === 0 ? (
        <p>Aucun point de vision publié pour le moment.</p>
      ) : (
        <ul className="vision-group__list">
          {items.map((item) => (
            <li key={item.id} className="vision-item">
              <span className="vision-item__title">{item.title}</span>
              {item.description && <p>{item.description}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function VisionSection() {
  return (
    <section className="section vision-section" id="vision">
      <div className="container">
        <SectionTitle
          eyebrow="Notre vision"
          title="Une vision inspirée, partagée et portée ensemble"
          subtitle="Le Centre Missionnaire Shimekah vit selon une vision claire, portée par son visionnaire et ses collaborateurs."
        />
        <div className="vision-section__grid">
          {GROUPS.map((group) => (
            <VisionGroup key={group.category} {...group} />
          ))}
        </div>
      </div>
    </section>
  )
}
