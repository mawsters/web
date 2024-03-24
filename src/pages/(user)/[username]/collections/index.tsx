import { Progress } from '@/components/ui/Progress'
import { useGetCollectionsQuery } from '@/data/clients/collections.api'
import * as React from 'react'

import { RocketIcon } from '@radix-ui/react-icons'

import { Collection, CollectionCreateButton } from '@/components/Collection'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert'
import { useParams } from 'react-router-dom'
import { logger } from '@/utils/debug'
import { cn } from '@/utils/dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { SingleCollection } from '@/types/collections'
import { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-react'

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
  // get the username from url
  const { username } = useParams()
  const { isSignedIn, user, isLoaded } = useUser()

  const user_uri = username!.slice(1)

  logger(
    { breakpoint: `[user/username/collections/index.tsx:46]` },
    `Username: ${user_uri} and ${user?.username}`,
  )

  const { data, isLoading, isError, isSuccess } = useGetCollectionsQuery({
    username: user_uri,
  })

  logger({ breakpoint: `[user/username/collections/index.tsx:54]` }, { data })

  // State for core and user collections
  const [coreCollection, setCoreCollection] = useState<SingleCollection[]>([])
  const [userCollection, setUserCollection] = useState<SingleCollection[]>([])
  const CORE = 'core'
  const USER = 'user'

  // Update collections whenever data changes
  useEffect(() => {
    if (data) {
      setCoreCollection((data.results.lists.core as SingleCollection[]) ?? [])
      setUserCollection((data.results.lists.user as SingleCollection[]) ?? [])
    }
  }, [data]) // Depend on data to trigger updates

  return (
    <>
      <section
        style={{
          backgroundImage: `linear-gradient(to bottom, hsl(var(--muted)) 0%, transparent 70%)`,
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
        }}
        className={cn(
          'relative w-full',
          'rounded-lg',

          'pt-8',
        )}
      >
        <div className="mx-auto grid w-11/12 grid-cols-1 place-content-center place-items-center gap-8 sm:grid-cols-2">
          {/* Assuming you want a 2-column layout on larger screens */}
          <div className="sm:col-span-2">
            {' '}
            {/* Span 2 columns on small and larger screens */}
            <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
              <span className="text-3xl lg:text-4xl">Welcome to </span>
              {username}'s Collections
            </h1>
          </div>
          <div className="sm:col-span-2">
            <p className="text-center leading-tight text-muted-foreground">
              Discover the books you have been reading recently and your
              favorite collections so far!
            </p>
          </div>
          {isLoaded && isSignedIn && user.username == user_uri && (
            <div className="m-2 sm:col-span-2">
              <CollectionCreateButton username={user_uri} />
            </div>
          )}
        </div>
      </section>

      {isLoading && (
        <div className="m-5 flex justify-center">
          <ProgressDemo />
        </div>
      )}

      {isError && <ErrorAlert error={'Something went wrong!'} />}

      {isSuccess && (
        <section
          className={cn(
            'relative w-full',
            'rounded-lg',

            'pt-8',
          )}
        >
          <Tabs
            defaultValue={CORE}
            className="w-full"
            aria-label="Collection Tabs"
          >
            <TabsList>
              <TabsTrigger value={CORE}>Core</TabsTrigger>
              <TabsTrigger value={USER}>Personal</TabsTrigger>
            </TabsList>
            <TabsContent value={CORE}>
              {isSuccess &&
                coreCollection.map((collection) => (
                  <Collection
                    key={collection.key}
                    collection={{
                      ...collection,
                      books: collection.books.map((book) => ({
                        ...book,
                        key: book.key,
                        source: book.source as
                          | 'shelvd'
                          | 'ol'
                          | 'nyt'
                          | 'google'
                          | 'hc',
                      })),
                    }}
                    username={user_uri}
                  >
                    <Collection.ViewCard
                      className="mt-5 grid justify-items-start"
                      listType={CORE}
                    />
                  </Collection>
                ))}
            </TabsContent>
            <TabsContent value={USER}>
              {isSuccess &&
                userCollection.map((collection) => (
                  <Collection
                    key={collection.key}
                    collection={{
                      ...collection,
                      books: collection.books.map((book) => ({
                        ...book,
                        key: book.key,
                        source: book.source as
                          | 'shelvd'
                          | 'ol'
                          | 'nyt'
                          | 'google'
                          | 'hc',
                      })),
                    }}
                    username={user_uri}
                  >
                    <Collection.ViewCard
                      className="mt-5 grid justify-items-start"
                      listType={USER}
                    />
                  </Collection>
                ))}
            </TabsContent>
          </Tabs>
        </section>
      )}
    </>
  )
}

export default CollectionsPage
