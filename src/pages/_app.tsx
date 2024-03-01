import { Nav } from '@/components/Layout.Nav'
import { SEO } from '@/components/Layout.SEO'
import Search from '@/components/Layout.Search'
import { Outlet } from 'react-router-dom'

const AppLayout = ({ seo }: { seo?: SEO }) => {
  return (
    <>
      <SEO {...seo} />

      <Search>
        <Nav />
        <Outlet />
      </Search>
    </>
  )
}

export default AppLayout
