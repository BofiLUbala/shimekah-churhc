import { useState } from 'react'
import EmptyState from '../components/EmptyState'
import Loader from '../components/Loader'
import PageHeader from '../components/PageHeader'
import { EventCard } from '../sections/EventsSection'
import NewsletterCTA from '../sections/NewsletterCTA'
import { useApi } from '../hooks/useApi'

export default function Events() {
  const [showPast, setShowPast] = useState(false)
  const { data, loading, error } = useApi(`/events/${showPast ? '' : '?upcoming=1'}`, [showPast])
  const events = Array.isArray(data) ? data : data?.results || []

  return (
    <>
      <PageHeader
        eyebrow="Événements"
        title="Événements de l'église"
        subtitle="Cultes, conférences, croisades, séminaires et formations."
      />
      <section className="section">
        <div className="container">
          <label className="toggle">
            <input
              type="checkbox"
              checked={showPast}
              onChange={(e) => setShowPast(e.target.checked)}
            />
            Afficher tous les événements (y compris passés)
          </label>

          {error && (
            <p className="form-feedback form-feedback--error">Impossible de charger les événements.</p>
          )}
          {loading && !data ? (
            <Loader />
          ) : !error && events.length === 0 ? (
            <EmptyState
              title={showPast ? 'Aucun événement' : 'Aucun événement à venir'}
              message="Les événements seront annoncés prochainement."
            />
          ) : (
            <div className="events-section__list">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>
      <NewsletterCTA />
    </>
  )
}
