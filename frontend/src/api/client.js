const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

async function request(path, options = {}) {
  const { body, headers = {}, ...rest } = options

  const config = {
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    ...rest,
  }

  if (body !== undefined) {
    config.body = JSON.stringify(body)
  }

  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, config)
  } catch {
    throw new ApiError(
      "Impossible de joindre le serveur. Vérifiez que le backend est démarré.",
      0,
      null,
    )
  }

  let data = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    let message = `Erreur ${response.status}`
    if (data) {
      if (typeof data.detail === 'string') {
        message = data.detail
      } else if (typeof data === 'object') {
        message = Object.entries(data)
          .map(([field, errors]) =>
            `${field} : ${Array.isArray(errors) ? errors.join(' ') : errors}`,
          )
          .join(' — ')
      }
    }
    throw new ApiError(message || response.statusText, response.status, data)
  }

  return data
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
}
