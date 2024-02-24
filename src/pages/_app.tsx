import { Nav } from '@/components/Layout.Nav'
import { SEO } from '@/components/Layout.SEO'
import { Outlet } from 'react-router-dom'

const AppLayout = ({ seo }: { seo?: SEO }) => {
  return (
    <>
      <SEO {...seo} />

      <Nav />

      <Outlet />
    </>
  )
}

export default AppLayout
