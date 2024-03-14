import { useNavigate, useParams } from '@/router'
import { cn } from '@/utils/dom'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

const UserLayout = () => {
  const navigate = useNavigate()
  const { username = '' } = useParams('/:username')

  const isValidUsername = username.startsWith('@')

  useEffect(() => {
    if (!isValidUsername) {
      navigate({
        pathname: '/',
      })
    }
  }, [isValidUsername, navigate])

  return (
    <main
      className={cn(
        'page-container',

        'flex flex-col gap-8',
        'place-items-center',
        '*:w-full',
      )}
    >
      <Outlet />
    </main>
  )
}

export default UserLayout
