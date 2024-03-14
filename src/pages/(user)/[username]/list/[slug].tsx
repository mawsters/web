import { List } from '@/components/List'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert'
import { useRootSelector } from '@/data/stores/root'
import { SearchSelectors } from '@/data/stores/search.slice'
import { useNavigate, useParams } from '@/router'
import { SearchArtifact } from '@/types/shelvd'
import { cn } from '@/utils/dom'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { useEffect } from 'react'

const UserListPage = () => {
  const navigate = useNavigate()
  const { username = '', slug = '' } = useParams('/:username/list/:slug')

  const isValidUsername = username.startsWith('@')
  const isValidSlug = !!slug.length

  useEffect(() => {
    if (!(isValidUsername || isValidSlug)) {
      navigate({
        pathname: '/lists',
      })
    }
  }, [isValidSlug, isValidUsername, navigate])

  //#endregion  //*======== STORE ===========
  const [current] = [useRootSelector(SearchSelectors.state).current]

  const isCurrentCategorySlug =
    current.slug === slug && current.category === 'lists'
  // const origin = current.origin as SourceOrigin<'hc', 'lists'>
  const list = current.common as SearchArtifact<'lists'>

  //#endregion  //*======== STORE ===========

  //#endregion  //*======== QUERIES ===========
  // const { lists } = HardcoverEndpoints
  // const { data } = lists.useQuery(
  //   {
  //     category: category as Hardcover.ListCategory,
  //   },
  //   {
  //     skip: !isValidCategory,
  //   },
  // )

  // const categoryLists: Hardcover.List[] = (data?.results ??
  //   []) as Hardcover.List[]
  //#endregion  //*======== QUERIES ===========

  return (
    <>
      {!isCurrentCategorySlug && (
        <Alert
          variant="warning"
          className="my-4 mb-8"
        >
          <ExclamationTriangleIcon className="size-4" />
          <AlertTitle>WIP</AlertTitle>
          <AlertDescription>This feature is in development</AlertDescription>
        </Alert>
      )}

      {isCurrentCategorySlug && !!list && (
        <List list={list!}>
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
            <div
              className={cn(
                'mx-auto w-11/12',
                'flex flex-col flex-wrap place-content-center place-items-center gap-8 sm:flex-row sm:place-content-start sm:place-items-start',
              )}
            >
              <aside className="flex flex-col gap-1 *:!mt-0">
                <h1>{list?.name ?? ''}</h1>

                <p className="leading-tight text-muted-foreground">
                  {list?.description ?? ''}
                </p>
              </aside>
            </div>
          </section>

          <main className="w-full overflow-auto">
            <div
              className={cn(
                'w-fit place-content-start place-items-start gap-2',
                'flex flex-row flex-wrap',
                'sm:max-w-xl',
              )}
            >
              <List.Books />
            </div>
          </main>
        </List>
      )}
    </>
  )
}

export default UserListPage
