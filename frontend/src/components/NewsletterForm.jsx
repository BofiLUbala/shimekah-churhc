import { useState } from 'react'
import { subscribeNewsletter } from '../api/services'

export default function NewsletterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState({ state: 'idle', message: null })

  function handleSubmit(event) {
    event.preventDefault()
    if (status.state === 'loading') return
    setStatus({ state: 'loading', message: null })

    subscribeNewsletter({ name, email })
      .then((data) => {
        setStatus({ state: 'success', message: data.detail })
        setName('')
        setEmail('')
      })
      .catch((err) => {
        setStatus({ state: 'error', message: err.message })
      })
  }

  return (
    <form className="newsletter-form" onSubmit={handleSubmit} noValidate>
      <div className="newsletter-form__row">
        <input
          type="text"
          placeholder="Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          aria-label="Nom"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-label="Email"
        />
        <button type="submit" className="btn btn--primary" disabled={status.state === 'loading'}>
          {status.state === 'loading' ? 'Inscription…' : "S'inscrire"}
        </button>
      </div>
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
  )
}
