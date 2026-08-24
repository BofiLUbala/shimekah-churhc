import EmptyState from '../components/EmptyState'
import Loader from '../components/Loader'
import SectionTitle from '../components/SectionTitle'
import { useApi } from '../hooks/useApi'

export default function StructuresSection({ compact = false }) {
  const { data, loading, error } = useApi('/structures/')
  const structures = Array.isArray(data) ? data : data?.results || []

  return (
    <section className={`section structures-section ${compact ? '' : 'section--alt'}`} id="structures">
      <div className="container">
        <SectionTitle
          eyebrow="Nos structures"
          title="Six piliers au service de la mission"
          subtitle="Chaque structure du Centre Missionnaire Shimekah répond à un appel précis."
        />
        {error && (
          <p className="form-feedback form-feedback--error">
            Impossible de charger les structures. Vérifiez que le serveur est démarré.
          </p>
        )}
        {loading && !data ? (
          <Loader />
        ) : !error && structures.length === 0 ? (
          <EmptyState title="Aucune structure" message="Les structures seront publiées prochainement." />
        ) : (
          <div className="cards-grid cards-grid--3">
            {structures.map((structure) => (
              <article key={structure.id} className="structure-card card">
                {structure.image && (
                  <img src={structure.image} alt={structure.acronym} className="structure-card__image" />
                )}
                {!structure.image && (
                  <div className="structure-card__badge" aria-hidden="true">
                    {structure.acronym.slice(0, 2)}
                  </div>
                )}
                <h3 className="structure-card__acronym">{structure.acronym}</h3>
                <p className="structure-card__name">{structure.name}</p>
                {structure.description && <p className="structure-card__description">{structure.description}</p>}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
