import Search from '@/components/Layout.Search'
import { Outlet } from 'react-router-dom'

const SearchLayout = () => {
  return (
    <main className="page-container overflow-hidden">
      <Search.Tabs
        isNavigatable
        trigger={{
          className: '*:h4',
        }}
      >
        <Outlet />
      </Search.Tabs>
    </main>
  )
}

export default SearchLayout
