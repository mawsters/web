import { useGetCollectionQuery } from '@/data/clients/collections.api'
import { useParams } from 'react-router-dom'
import { ErrorAlert, ProgressDemo } from '@/pages/collections/index'
import { Collection } from '@/components/Collection'

const CollectionPage = () => {
  const { slug } = useParams()
  const { data, isLoading, isError, error, isSuccess } = useGetCollectionQuery(
    slug!,
  )
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <ProgressDemo />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <ErrorAlert error={error.toString()} />
      </div>
    )
  }

  if (isSuccess) {
    console.log('Data', data)
    return (
      <Collection collection={data}>
        <div className="justify-top flex h-screen flex-col items-center">
          <Collection.Header />
          <Collection.BookList />
        </div>
      </Collection>
    )
  }
}

export default CollectionPage
