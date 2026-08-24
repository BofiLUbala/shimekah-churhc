import NewsletterForm from '../components/NewsletterForm'

export default function NewsletterCTA() {
  return (
    <section className="newsletter-cta">
      <div className="container newsletter-cta__inner">
        <div>
          <h2>Restez informé</h2>
          <p>Restez informé des activités du Centre Missionnaire Shimekah.</p>
        </div>
        <NewsletterForm />
      </div>
    </section>
  )
}
