import { Nav } from '@/components/Layout.Nav'
import { SEO } from '@/components/Layout.SEO'
import { Search } from '@/components/Layout.Search'
import User from '@/components/Layout.User'
import { RenderGuard } from '@/components/providers/render.provider'
import { Outlet } from 'react-router-dom'

const AppLayout = ({ seo }: { seo?: SEO }) => {
  return (
    <RenderGuard>
      <SEO {...seo} />
      <Search>
        <User>
          <Nav />
          <Outlet />
        </User>
      </Search>
    </RenderGuard>
  )
}

export default AppLayout
