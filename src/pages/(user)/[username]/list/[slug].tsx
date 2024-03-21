import { List } from '@/components/List'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert'
import { ShelvdEndpoints } from '@/data/clients/shelvd.api'
import { useRootDispatch, useRootSelector } from '@/data/stores/root'
import { SearchActions, SearchSelectors } from '@/data/stores/search.slice'
import { useNavigate, useParams } from '@/router'
import { ListData, ListType, SearchArtifact } from '@/types/shelvd'
import { logger } from '@/utils/debug'
import { cn } from '@/utils/dom'
import {
  QuestionMarkCircledIcon,
  UpdateIcon,
  ExclamationTriangleIcon,
} from '@radix-ui/react-icons'
import { useEffect, useMemo } from 'react'

const UserListPage = () => {
  const navigate = useNavigate()
  const { username = '', slug = '' } = useParams('/:username/list/:slug')

  const isValidUsername = username.startsWith('@')
  const isValidSlug = !!slug.length
  const isValidParams = isValidSlug && isValidUsername

  useEffect(() => {
    if (!(isValidUsername || isValidSlug)) {
      navigate({
        pathname: '/lists',
      })
    }
  }, [isValidSlug, isValidUsername, navigate])

  //#endregion  //*======== STORE ===========
  const dispatch = useRootDispatch()
  const [current, setCurrent] = [
    useRootSelector(SearchSelectors.state).current,
    SearchActions.setCurrent,
  ]
  const isCurrentCategorySlug =
    current.slug === slug && current.category === 'lists'
  // const origin = current.origin as SourceOrigin<'hc', 'lists'>
  const list = current.common as SearchArtifact<'lists'>

  //#endregion  //*======== STORE ===========

  //#endregion  //*======== QUERIES ===========

  const { getList } = ShelvdEndpoints
  const shelvdCreatedListQuery = getList.useQuery(
    {
      username,
      key: slug,
      type: ListType.enum.created,
    },
    {
      skip: !isValidParams,
    },
  )

  const ctx: Omit<typeof current, 'source' | 'slug' | 'category'> =
    useMemo(() => {
      const { data, isSuccess } = shelvdCreatedListQuery

      logger({ breakpoint: '[[slug].tsx:58]' }, { shelvdCreatedListQuery })
      const isLoading =
        shelvdCreatedListQuery.isLoading || shelvdCreatedListQuery.isFetching
      let isNotFound = !isLoading && !isSuccess

      let origin = undefined
      let common = undefined

      if (data) {
        // source: 'shelvd' = assume common
        origin = data
        common = data
      } else {
        isNotFound = true
      }

      return {
        origin,
        common,

        isNotFound,
        isLoading,
      }
    }, [shelvdCreatedListQuery])

  //#endregion  //*======== QUERIES ===========

  useEffect(() => {
    if (!isValidParams || ctx.isLoading) return

    dispatch(
      setCurrent({
        slug,
        source: 'shelvd' as typeof current.source,
        category: 'lists',
        ...ctx,
      }),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx, isValidParams, setCurrent])

  //#endregion  //*======== STATUS ===========
  const { isLoading, isNotFound } = current

  const StatusIcon = isNotFound ? QuestionMarkCircledIcon : UpdateIcon
  const StatusText = isNotFound ? 'Not Found' : 'Hang on...'
  //#endregion  //*======== STATUS ===========

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

      <div
        className={cn(
          'flex w-full flex-row place-content-center place-items-center gap-2 text-muted-foreground',
          !(isLoading || isNotFound) && '!hidden',
        )}
      >
        <StatusIcon
          className={cn('size-4 animate-spin', isNotFound && 'animate-none')}
        />
        <span>{StatusText}</span>
      </div>

      {isCurrentCategorySlug && !!list && (
        <List data={ListData.parse(list)}>
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
