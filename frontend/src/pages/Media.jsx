import { useState } from 'react'
import EmptyState from '../components/EmptyState'
import Loader from '../components/Loader'
import PageHeader from '../components/PageHeader'
import YouTubeEmbed from '../components/YouTubeEmbed'
import { useApi } from '../hooks/useApi'

function formatDate(value) {
  if (!value) return ''
  return new Date(value).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function Media() {
  const [page, setPage] = useState(1)
  const { data, loading, error } = useApi(`/videos/?page=${page}`, [page])
  const videos = data?.results || []
  const featured = videos.find((v) => v.is_featured)
  const others = featured ? videos.filter((v) => v.id !== featured.id) : videos
  const hasNextPage = Boolean(data?.next)

  return (
    <>
      <PageHeader
        eyebrow="Médias"
        title="Vidéos et prédications"
        subtitle="Revivez les cultes, prédications et événements en vidéo."
      />
      <section className="section">
        <div className="container">
          {error && (
            <p className="form-feedback form-feedback--error">Impossible de charger les vidéos.</p>
          )}
          {loading && !data ? (
            <Loader />
          ) : !error && videos.length === 0 ? (
            <EmptyState
              title="Aucune vidéo pour le moment"
              message="Les prédications seront publiées prochainement."
            />
          ) : (
            <>
              {featured && (
                <div className="media-section__featured">
                  <h3 className="media-section__subtitle">Vidéo à la une</h3>
                  <p className="media-section__title">{featured.title}</p>
                  <YouTubeEmbed videoId={featured.youtube_video_id} title={featured.title} />
                </div>
              )}
              {others.length > 0 && (
                <>
                  <h3 className="media-section__subtitle">Dernières prédications</h3>
                  <div className="cards-grid cards-grid--2">
                    {others.map((video) => (
                      <article key={video.id} className="video-card card">
                        <YouTubeEmbed videoId={video.youtube_video_id} title={video.title} />
                        <div className="video-card__body">
                          <h4>{video.title}</h4>
                          <time>{formatDate(video.published_at)}</time>
                        </div>
                      </article>
                    ))}
                  </div>
                </>
              )}
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
