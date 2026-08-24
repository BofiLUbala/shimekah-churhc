import { Link } from 'react-router-dom'

export default function EmptyState({
  title = "Contenu indisponible",
  message = "Le contenu n'est pas encore disponible. Revenez bientôt.",
  linkTo = null,
  linkLabel = null,
}) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{message}</p>
      {linkTo && linkLabel && (
        <Link className="btn btn--outline" to={linkTo}>
          {linkLabel}
        </Link>
      )}
    </div>
  )
}
