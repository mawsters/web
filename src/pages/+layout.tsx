import { Nav } from '@/components/Layout.Nav'
import { Outlet } from 'react-router-dom'

export const IndexLayout = () => {
  return (
    <>
      <Nav />
      <Outlet />
    </>
  )
}
