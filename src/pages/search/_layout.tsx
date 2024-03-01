import Search from '@/components/Layout.Search'
import { Outlet } from 'react-router-dom'

const SearchLayout = () => {
  return (
    <main className="page-container overflow-hidden">
      <Search.Tabs isNavigatable>
        <Outlet />
      </Search.Tabs>
    </main>
  )
}

export default SearchLayout
