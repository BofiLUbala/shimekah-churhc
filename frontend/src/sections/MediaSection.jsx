import EmptyState from '../components/EmptyState'
import Loader from '../components/Loader'
import SectionTitle from '../components/SectionTitle'
import YouTubeEmbed from '../components/YouTubeEmbed'
import { useApi } from '../hooks/useApi'
import { useChurch } from '../context/ChurchContext'

export default function MediaSection() {
  const { data, loading, error } = useApi('/videos/')
  const videos = Array.isArray(data) ? data : data?.results || []
  const featured = videos.find((v) => v.is_featured) || null
  const latest = (featured ? videos.filter((v) => v.id !== featured.id) : videos).slice(0, 3)
  const { church } = useChurch()
  const socials = church?.social_links || []

  return (
    <section className="section section--dark media-section" id="media">
      <div className="container">
        <SectionTitle
          eyebrow="Médias"
          title="Vidéos et prédications"
          subtitle="Revivez les cultes, prédications et événements en vidéo."
        />
        <div className="social-buttons">
          {socials.map((link) => (
            <a
              key={link.id}
              className="btn btn--outline-light btn--sm"
              href={link.url || undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!link.url}
            >
              {link.platform}
            </a>
          ))}
        </div>

        {error && (
          <p className="form-feedback form-feedback--error">Impossible de charger les vidéos.</p>
        )}
        {loading && !data ? (
          <Loader />
        ) : !error && videos.length === 0 ? (
          <EmptyState
            title="Aucune vidéo pour le moment"
            message="Les prédications et vidéos seront publiées prochainement."
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
            {latest.length > 0 && (
              <div className="media-section__latest">
                <h3 className="media-section__subtitle">Dernières prédications</h3>
                <div className="cards-grid cards-grid--3">
                  {latest.map((video) => (
                    <article key={video.id} className="video-card card">
                      <YouTubeEmbed videoId={video.youtube_video_id} title={video.title} />
                      <div className="video-card__body">
                        <h4>{video.title}</h4>
                        {video.published_at && (
                          <time dateTime={video.published_at}>
                            {new Date(video.published_at).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </time>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
