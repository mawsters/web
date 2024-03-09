import { Progress } from '@/components/ui/Progress'
import { useGetCollectionsQuery } from '@/data/clients/collections.api'
import * as React from 'react'

import { RocketIcon } from '@radix-ui/react-icons'

import { Collection, CollectionCreateButton } from '@/components/Collection'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert'

export function ProgressDemo() {
  const [progress, setProgress] = React.useState<number>(13)

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Progress
      value={progress}
      className="w-[60%]"
    />
  )
}

export function ErrorAlert({ error }: { error: string }) {
  return (
    <Alert>
      <RocketIcon className="size-4" />
      <AlertTitle>Error!</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  )
}

const CollectionsPage = () => {
  const { data, isLoading, isError, error, isSuccess } =
    useGetCollectionsQuery()

  return (
    <>
      <div className="flex flex-row place-content-between place-items-center gap-4">
        <h1>Collections</h1>
        <CollectionCreateButton />
      </div>

      <section className="flex w-full flex-col items-center justify-center">
        {isLoading && <ProgressDemo />}

        {isError && <ErrorAlert error={error.toString()} />}

        {isSuccess &&
          (data ?? []).map((collection) => {
            return (
              <Collection
                key={collection.id}
                collection={collection}
              >
                <Collection.ViewCard className="relative mt-5 flex h-[100px] w-[500px] items-center" />
              </Collection>
            )
          })}
      </section>
    </>
  )
}

export default CollectionsPage
