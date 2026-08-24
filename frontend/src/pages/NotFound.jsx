import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'

export default function NotFound() {
  return (
    <>
      <PageHeader eyebrow="Erreur 404" title="Page introuvable" />
      <section className="section">
        <div className="container">
          <EmptyState
            title="Cette page n'existe pas"
            message="Le lien que vous avez suivi est peut-être erroné."
            linkTo="/"
            linkLabel="Retour à l'accueil"
          />
        </div>
      </section>
    </>
  )
}
