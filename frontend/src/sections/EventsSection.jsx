import EmptyState from '../components/EmptyState'
import Loader from '../components/Loader'
import SectionTitle from '../components/SectionTitle'
import { useApi } from '../hooks/useApi'
import { formatDate } from './NewsSection'

export function EventCard({ event }) {
  return (
    <article className="event-card card">
      <div className="event-card__date">
        <span className="event-card__day">
          {new Date(event.start_date).toLocaleDateString('fr-FR', { day: 'numeric' })}
        </span>
        <span className="event-card__month">
          {new Date(event.start_date).toLocaleDateString('fr-FR', { month: 'short' })}
        </span>
      </div>
      <div className="event-card__body">
        <h3>{event.title}</h3>
        <p className="event-card__meta">
          📍 {event.location || 'Lieu à préciser'}
          {event.start_time && <> · 🕒 {event.start_time.slice(0, 5)}</>}
          {event.end_date && event.end_date !== event.start_date && (
            <> → jusqu'au {formatDate(event.end_date)}</>
          )}
        </p>
        {event.description && (
          <p className="event-card__description">
            {event.description.length > 160
              ? `${event.description.slice(0, 160)}…`
              : event.description}
          </p>
        )}
      </div>
    </article>
  )
}

export default function EventsSection({ limit = 3 }) {
  const { data, loading, error } = useApi('/events/?upcoming=1')
  const rawEvents = Array.isArray(data) ? data : data?.results || []
  const events = limit ? rawEvents.slice(0, limit) : rawEvents

  return (
    <section className="section section--alt events-section" id="events">
      <div className="container">
        <SectionTitle
          eyebrow="Événements"
          title="Prochains événements"
          subtitle="Cultes, conférences, croisades et formations à ne pas manquer."
        />
        {error && (
          <p className="form-feedback form-feedback--error">Impossible de charger les événements.</p>
        )}
        {loading && !data ? (
          <Loader />
        ) : !error && events.length === 0 ? (
          <EmptyState
            title="Aucun événement à venir"
            message="Les prochains événements seront annoncés prochainement."
          />
        ) : (
          <>
            <div className="events-section__list">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
