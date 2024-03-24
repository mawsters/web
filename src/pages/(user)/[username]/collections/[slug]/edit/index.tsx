import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert'
import { useNavigate, useParams } from '@/router'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { useEffect } from 'react'

const UserCollectionEditPage = () => {
  const navigate = useNavigate()
  const { username = '', slug = '' } = useParams('/:username/collections/:slug')

  const isValidUsername = username.startsWith('@')
  const isValidSlug = !!slug.length

  useEffect(() => {
    if (!(isValidUsername || isValidSlug)) {
      navigate('/')
    }
  }, [isValidSlug, isValidUsername, navigate])

  //#endregion  //*======== STORE ===========

  //#endregion  //*======== QUERIES ===========

  // get the current collection slug

  //#endregion  //*======== QUERIES ===========

  return (
    <>
      {
        <Alert
          variant="warning"
          className="my-4 mb-8"
        >
          <ExclamationTriangleIcon className="size-4" />
          <AlertTitle>WIP</AlertTitle>
          <AlertDescription>This feature is in development</AlertDescription>
        </Alert>
      }
    </>
  )
}

export default UserCollectionEditPage
