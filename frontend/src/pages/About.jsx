import PageHeader from '../components/PageHeader'
import { useChurch } from '../context/ChurchContext'

export default function About() {
  const { church } = useChurch()

  return (
    <>
      <PageHeader eyebrow="À propos" title={`Qui sommes-nous ?`} />
      <section className="section">
        <div className="container about-page">
          <p className="lead">
            {church?.denomination} — {church?.church_name}
          </p>
          <p>{church?.description}</p>
          <blockquote className="quote">« {church?.mission_statement} »</blockquote>

          <h2>Notre histoire</h2>
          <p>
            Le Centre Missionnaire Shimekah a vu le jour le{' '}
            {church?.founded_date &&
              new Date(church.founded_date).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            . Depuis, l'œuvre ne cesse de grandir à travers ses six structures et son engagement
            pour un retour à la foi authentique.
          </p>

          <h2>Nous trouver</h2>
          <ul className="info-list">
            <li>
              <strong>Adresse :</strong> {church?.address}
            </li>
            <li>
              <strong>Référence :</strong> {church?.location_reference}
            </li>
            <li>
              <strong>Téléphones :</strong> {church?.phone_primary}
              {church?.phone_secondary && ` / ${church.phone_secondary}`}
            </li>
            <li>
              <strong>Email :</strong> {church?.email}
            </li>
          </ul>
        </div>
      </section>
    </>
  )
}
