import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { Outlet } from 'react-router-dom'

const DevBanner = () => {
  return (
    <Alert
      variant="warning"
      className="mb-8"
    >
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertTitle>Server Not Available</AlertTitle>
      <AlertDescription>
        Mock server is only available in local development mode
      </AlertDescription>
    </Alert>
  )
}

const CollectionLayout = () => {
  return (
    <main className="page-container">
      <DevBanner />
      <Outlet />
    </main>
  )
}

export default CollectionLayout
