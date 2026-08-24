import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import Loader from '../components/Loader'
import SectionTitle from '../components/SectionTitle'
import { useApi } from '../hooks/useApi'

export function formatDate(value) {
  if (!value) return ''
  return new Date(value).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function NewsCard({ item }) {
  return (
    <article className="news-card card">
      <Link to={`/news/${item.slug}`} className="news-card__image-link">
        {item.cover_image ? (
          <img src={item.cover_image} alt={item.title} className="news-card__image" />
        ) : (
          <div className="news-card__image news-card__image--placeholder" aria-hidden="true">
            ✝
          </div>
        )}
      </Link>
      <div className="news-card__body">
        <time dateTime={item.published_at}>{formatDate(item.published_at)}</time>
        <h3 className="news-card__title">{item.title}</h3>
        {item.summary && <p>{item.summary}</p>}
        <Link to={`/news/${item.slug}`} className="btn btn--outline btn--sm">
          Lire la suite
        </Link>
      </div>
    </article>
  )
}

export default function NewsSection({ limit = 3, showAll = false }) {
  const { data, loading, error } = useApi('/news/')
  const rawItems = Array.isArray(data) ? data : data?.results || []
  let items = rawItems
  if (limit && !showAll) items = items.slice(0, limit)

  return (
    <section className="section news-section" id="news">
      <div className="container">
        <SectionTitle
          eyebrow="Actualités"
          title="Dernières nouvelles de l'église"
          subtitle="Suivez les annonces et événements marquants du Centre Missionnaire Shimekah."
        />
        {error && (
          <p className="form-feedback form-feedback--error">Impossible de charger les actualités.</p>
        )}
        {loading && !data ? (
          <Loader />
        ) : !error && items.length === 0 ? (
          <EmptyState title="Aucune actualité" message="Aucune actualité publiée pour le moment." />
        ) : (
          <>
            {showAll && data?.results?.find((n) => n.is_featured) && (
              <p className="news-section__featured-note">★ Actualité à la une mise en avant</p>
            )}
            <div className="cards-grid cards-grid--3">
              {items.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
            {!showAll && (data?.count || 0) > limit && (
              <div className="section__more">
                <Link to="/news" className="btn btn--primary">
                  Voir toutes les actualités
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
