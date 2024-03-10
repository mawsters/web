import Author from '@/components/Author'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { HardcoverEndpoints } from '@/data/clients/hardcover.api'
import { useRootDispatch, useRootSelector } from '@/data/stores/root'
import {
  SearchActions,
  SearchSelectors,
  SourceOrigin,
} from '@/data/stores/search.slice'
import { useNavigate, useParams } from '@/router'
import { Hardcover } from '@/types'
import {
  AuthorDetailCategory,
  BookSource,
  DefaultAuthorDetailCategory,
  SearchArtifact,
  SearchCategory,
} from '@/types/shelvd'
import { HardcoverUtils } from '@/utils/clients/hardcover'
import { cn } from '@/utils/dom'
import { QuestionMarkCircledIcon, UpdateIcon } from '@radix-ui/react-icons'
import { useEffect, useMemo } from 'react'
import { Outlet, useLocation } from 'react-router'

const AuthorLayout = () => {
  const navigate = useNavigate()

  const { slug = '', '*': category = DefaultAuthorDetailCategory } =
    useParams('/author/:slug?/*')
  const { state } = useLocation()

  //#endregion  //*======== STORE ===========
  const dispatch = useRootDispatch()
  const [current, setCurrent] = [
    useRootSelector(SearchSelectors.state).current,
    SearchActions.setCurrent,
  ]
  //#endregion  //*======== STORE ===========

  const searchCategory = SearchCategory.enum.authors
  const source: BookSource = (state?.source ?? current.source) as BookSource

  const isValidSource = BookSource.safeParse(source).success
  const isValidCategory = AuthorDetailCategory.safeParse(category).success
  const isValidSlug = !!slug.length
  const isValidParams = isValidSlug && isValidCategory && isValidSource

  //#endregion  //*======== SOURCE/hc ===========
  const { searchExact: hcSearch } = HardcoverEndpoints
  const hcSearchQuery = hcSearch.useQuery(
    {
      category: searchCategory,
      q: slug,
    },
    {
      skip: !isValidParams || source !== 'hc',
    },
  )

  const hc: Omit<typeof current, 'source' | 'slug' | 'category'> =
    useMemo(() => {
      const { data, isSuccess } = hcSearchQuery

      const results = data?.results?.[0]
      const isLoading = hcSearchQuery.isLoading || hcSearchQuery.isFetching
      const isNotFound = !isLoading && !isSuccess && (results?.found ?? 0) < 1

      let origin = undefined
      let common = undefined

      const hit = (results?.hits ?? [])?.[0]
      if (hit) {
        const document = hit.document as Hardcover.SearchAuthor
        const hcAuthor = HardcoverUtils.parseAuthorDocument({ document })
        const author: Author = HardcoverUtils.parseAuthor(hcAuthor)

        origin = document
        common = author
      }

      return {
        origin,
        common,

        isNotFound,
        isLoading,
      }
    }, [hcSearchQuery])

  //#endregion  //*======== SOURCE/hc ===========

  const ctx = useMemo(() => {
    switch (source) {
      case 'hc': {
        return hc
      }
      default: {
        return {
          origin: undefined,
          common: undefined,

          isNotFound: true,
          isLoading: false,
        }
      }
    }
  }, [hc, source])

  useEffect(() => {
    if (!isValidParams) return
    const params = {
      slug,
      source,
      category: searchCategory,
    }
    dispatch(
      setCurrent({
        ...params,
        ...ctx,
      }),
    )
  }, [ctx, dispatch, isValidParams, searchCategory, setCurrent, slug, source])

  const { isLoading, isNotFound } = current

  const origin = current.origin as SourceOrigin<'hc', 'authors'>
  const author = current.common as SearchArtifact<'authors'>

  //#endregion  //*======== STATUS ===========
  const StatusIcon = isNotFound ? QuestionMarkCircledIcon : UpdateIcon
  const StatusText = isNotFound ? 'Not Found' : 'Hang on...'
  //#endregion  //*======== STATUS ===========

  return (
    <main
      className={cn(
        'page-container',

        'flex flex-col gap-8',
        'place-items-center',
        '*:w-full',
      )}
    >
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

      {!!author && (
        <Author author={author!}>
          <section
            style={{
              backgroundImage: `linear-gradient(to bottom, ${origin?.image?.color ?? 'transparent'} 0%, transparent 70%)`,
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
              <Author.Image />

              <aside className="flex flex-col gap-1 *:!mt-0">
                <h1>{author?.name ?? ''}</h1>

                <p>
                  {author?.name ?? ''} has written at least{' '}
                  {author?.bookCount ?? 0} books.
                </p>
              </aside>
            </div>
          </section>

          <Tabs
            defaultValue={DefaultAuthorDetailCategory}
            value={category}
            onValueChange={(c) => {
              const isValidCategory = AuthorDetailCategory.safeParse(c).success
              if (!isValidCategory) return

              const isDefaultCategory = c === DefaultAuthorDetailCategory
              navigate(
                {
                  pathname: '/author/:slug?/*',
                },
                {
                  state: {
                    source,
                  },
                  params: {
                    slug,
                    '*': isDefaultCategory ? '' : c,
                  },
                  unstable_viewTransition: true,
                },
              )
            }}
            className={cn('relative w-full', isLoading && 'hidden')}
          >
            <TabsList
              className={cn(
                '!h-auto !rounded-none border-b !bg-transparent pb-0',
                '*:rounded-b-none *:border-b *:!bg-transparent *:transition-all',
                'flex w-full flex-row !place-content-start place-items-center gap-x-4',

                'overflow-x-auto border-transparent sm:border-border',
              )}
            >
              {AuthorDetailCategory.options.map((cat) => (
                <TabsTrigger
                  key={`search-tab-${cat}`}
                  value={cat}
                  className={cn(
                    'capitalize',
                    'data-[state=active]:border-primary',
                  )}
                  // style={{
                  //   ...(source == 'hc' &&
                  //     cat === category && {
                  //     borderColor: origin?.image?.color,
                  //   }),
                  // }}
                >
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
            <Outlet />
          </Tabs>
        </Author>
      )}
    </main>
  )
}

export default AuthorLayout
