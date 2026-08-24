import { Link, useParams } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import Loader from '../components/Loader'
import { useApi } from '../hooks/useApi'
import { formatDate } from '../sections/NewsSection'

export default function NewsDetail() {
  const { slug } = useParams()
  const { data: article, loading, error } = useApi(`/news/${slug}/`, [slug])

  return (
    <>
      <div className="page-header">
        <div className="container">
          <Link to="/news" className="back-link">
            ← Retour aux actualités
          </Link>
        </div>
      </div>
      <section className="section">
        <div className="container news-detail">
          {loading && <Loader />}
          {error && error.status === 404 && (
            <EmptyState
              title="Actualité introuvable"
              message="Cette actualité n'existe pas ou n'est plus publiée."
              linkTo="/news"
              linkLabel="Voir toutes les actualités"
            />
          )}
          {error && error.status !== 404 && (
            <p className="form-feedback form-feedback--error">{error.message}</p>
          )}
          {article && (
            <article>
              <h1>{article.title}</h1>
              <p className="news-detail__meta">
                Publiée le {formatDate(article.published_at)}
                {article.is_featured && ' · ★ À la une'}
              </p>
              {article.cover_image && (
                <img src={article.cover_image} alt={article.title} className="news-detail__image" />
              )}
              {article.summary && <p className="lead">{article.summary}</p>}
              <div className="news-detail__content">
                {article.content.split(/\n{2,}/).map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </article>
          )}
        </div>
      </section>
    </>
  )
}
