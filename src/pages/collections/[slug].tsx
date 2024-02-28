import { useGetCollectionQuery } from '@/data/clients/collections.api'
import { useParams } from 'react-router-dom'
import { ErrorAlert, ProgressDemo } from '@/pages/collections/index'
import { Collection } from '@/components/Collection'

const CollectionPage = () => {
  const { slug } = useParams()
  const { data, isLoading, isError, error, isSuccess } = useGetCollectionQuery(
    slug!,
  )

  return (
    <>
      {isLoading && <ProgressDemo />}

      {isError && <ErrorAlert error={error.toString()} />}

      {isSuccess && (
        <Collection collection={data}>
          <div className="justify-top flex flex-col items-center">
            <Collection.Header />
            <Collection.BookList />
          </div>
        </Collection>
      )}
    </>
  )
}

export default CollectionPage
