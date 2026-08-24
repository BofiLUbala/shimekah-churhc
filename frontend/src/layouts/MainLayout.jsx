import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import FloatingButton from '../components/FloatingButton'

export default function MainLayout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return (
    <div className="site">
      <Header />
      <main className="main">
        <Outlet />
      </main>
      <Footer />
      <FloatingButton />
    </div>
  )
}
