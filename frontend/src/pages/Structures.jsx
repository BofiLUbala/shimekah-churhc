import PageHeader from '../components/PageHeader'
import StructuresSection from '../sections/StructuresSection'

export default function Structures() {
  return (
    <>
      <PageHeader
        eyebrow="Nos structures"
        title="Les structures du Centre Missionnaire Shimekah"
        subtitle="Six branches au service de l'évangélisation, de la formation et du développement."
      />
      <StructuresSection compact />
    </>
  )
}
