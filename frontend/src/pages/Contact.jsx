import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { useChurch } from '../context/ChurchContext'
import { sendContactMessage } from '../api/services'

const INITIAL_FORM = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
}

export default function Contact() {
  const { church } = useChurch()
  const [form, setForm] = useState(INITIAL_FORM)
  const [status, setStatus] = useState({ state: 'idle', message: null })

  function updateField(field) {
    return (event) => setForm((f) => ({ ...f, [field]: event.target.value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (status.state === 'loading') return
    setStatus({ state: 'loading', message: null })

    sendContactMessage(form)
      .then(() => {
        setStatus({
          state: 'success',
          message: 'Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais.',
        })
        setForm(INITIAL_FORM)
      })
      .catch((err) => {
        setStatus({ state: 'error', message: err.message })
      })
  }

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Nous contacter"
        subtitle="Une question, une prière, un témoignage ? Écrivez-nous."
      />
      <section className="section">
        <div className="container contact-page">
          <div className="contact-info card">
            <h2>Nos coordonnées</h2>
            <address>
              {church?.address}
              {church?.location_reference && (
                <>
                  <br />
                  Référence : {church.location_reference}
                </>
              )}
            </address>
            <p className="contact-info__phones">
              <a href={`tel:${church?.phone_primary}`}>{church?.phone_primary}</a>
              {church?.phone_secondary && (
                <>
                  {' · '}
                  <a href={`tel:${church?.phone_secondary}`}>{church.phone_secondary}</a>
                </>
              )}
            </p>
            <p>
              <a href={`mailto:${church?.email}`}>{church?.email}</a>
            </p>
            {(church?.social_links || []).length > 0 && (
              <>
                <h3>Retrouvez-nous</h3>
                <div className="social-buttons social-buttons--start">
                  {church.social_links.map((link) => (
                    <a
                      key={link.id}
                      className="btn btn--outline btn--sm"
                      href={link.url || undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.platform}
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>

          <form className="contact-form card" onSubmit={handleSubmit} noValidate>
            <h2>Envoyer un message</h2>
            <label>
              Nom *
              <input type="text" value={form.name} onChange={updateField('name')} required />
            </label>
            <label>
              Email *
              <input type="email" value={form.email} onChange={updateField('email')} required />
            </label>
            <label>
              Téléphone
              <input type="tel" value={form.phone} onChange={updateField('phone')} />
            </label>
            <label>
              Sujet *
              <input type="text" value={form.subject} onChange={updateField('subject')} required />
            </label>
            <label>
              Message *
              <textarea rows={6} value={form.message} onChange={updateField('message')} required />
            </label>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={status.state === 'loading'}
            >
              {status.state === 'loading' ? 'Envoi en cours…' : 'Envoyer le message'}
            </button>
            {status.state === 'success' && (
              <p className="form-feedback form-feedback--success" role="status">
                ✓ {status.message}
              </p>
            )}
            {status.state === 'error' && (
              <p className="form-feedback form-feedback--error" role="alert">
                ✕ {status.message}
              </p>
            )}
          </form>
        </div>
      </section>
    </>
  )
}
