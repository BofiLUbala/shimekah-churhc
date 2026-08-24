import SectionTitle from '../components/SectionTitle'

export default function PageHeader({ eyebrow, title, subtitle }) {
  return (
    <div className="page-header">
      <div className="container">
        {eyebrow && (
          <SectionTitle eyebrow={eyebrow} title={title} subtitle={subtitle} />
        )}
      </div>
    </div>
  )
}
