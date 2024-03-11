import { useNavigate, useParams } from '@/router'
import { useEffect } from 'react'

const UserDetailPage = () => {
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
    <main className="page-container">
      <p>UserDetailPage | {username}</p>
    </main>
  )
}

export default UserDetailPage
