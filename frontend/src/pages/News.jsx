import { useState } from 'react'
import EmptyState from '../components/EmptyState'
import Loader from '../components/Loader'
import PageHeader from '../components/PageHeader'
import { NewsCard } from '../sections/NewsSection'
import { useApi } from '../hooks/useApi'

export default function News() {
  const [page, setPage] = useState(1)
  const { data, loading, error } = useApi(`/news/?page=${page}`, [page])
  const items = data?.results || []
  const hasNextPage = Boolean(data?.next)

  return (
    <>
      <PageHeader
        eyebrow="Actualités"
        title="Actualités de l'église"
        subtitle="Annonces, témoignages et temps forts de la vie de l'église."
      />
      <section className="section">
        <div className="container">
          {error && (
            <p className="form-feedback form-feedback--error">
              Impossible de charger les actualités.
            </p>
          )}
          {loading && !data ? (
            <Loader />
          ) : !error && items.length === 0 ? (
            <EmptyState
              title="Aucune actualité"
              message="Aucune actualité n'a encore été publiée."
            />
          ) : (
            <>
              <div className="cards-grid cards-grid--3">
                {items.map((item) => (
                  <NewsCard key={item.id} item={item} />
                ))}
              </div>
              {(page > 1 || hasNextPage) && (
                <div className="pagination">
                  <button
                    type="button"
                    className="btn btn--outline"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    ← Précédent
                  </button>
                  <span>Page {page}</span>
                  <button
                    type="button"
                    className="btn btn--outline"
                    disabled={!hasNextPage}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Suivant →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}
