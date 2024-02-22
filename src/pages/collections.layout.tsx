import * as React from 'react'
import { useAuth } from '@clerk/clerk-react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Nav } from '@/components/Layout.Nav'

const CollectionLayout = () => {
  const { userId, isLoaded } = useAuth()
  const navigate = useNavigate()

  console.log('test', userId)

  React.useEffect(() => {
    if (!userId) {
      navigate('/')
    }
  }, [navigate, userId])

  if (!isLoaded) return 'Loading...'

  return (
    <>
      <Nav />
      <Outlet />
    </>
  )
}

export default CollectionLayout
