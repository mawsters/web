import Book from '@/components/Book'
import { Badge } from '@/components/ui/Badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { HardcoverEndpoints } from '@/data/clients/hardcover.api'
import { useRootDispatch, useRootSelector } from '@/data/stores/root'
import {
  SearchActions,
  SearchSelectors,
  SourceOrigin,
} from '@/data/stores/search.slice'
import { Link, useNavigate, useParams } from '@/router'
import { Hardcover } from '@/types'
import {
  BookDetailCategory,
  BookSource,
  DefaultBookDetailCategory,
  SearchArtifact,
  SearchCategory,
} from '@/types/shelvd'
import { HardcoverUtils } from '@/utils/clients/hardcover'
import { cn } from '@/utils/dom'
import { QuestionMarkCircledIcon, UpdateIcon } from '@radix-ui/react-icons'
import { useEffect, useMemo } from 'react'
import { Outlet } from 'react-router'
import { useLocation } from 'react-router-dom'

const DisplayBookDetailCategories = BookDetailCategory.extract([
  'info',
  'reviews',
])

const BookLayout = () => {
  const navigate = useNavigate()

  const { slug = '', '*': category = DefaultBookDetailCategory } =
    useParams('/book/:slug?/*')
  const { state } = useLocation()

  //#endregion  //*======== STORE ===========
  const dispatch = useRootDispatch()
  const [current, setCurrent] = [
    useRootSelector(SearchSelectors.state).current,
    SearchActions.setCurrent,
  ]
  //#endregion  //*======== STORE ===========

  const searchCategory = SearchCategory.enum.books
  const source: BookSource = (state?.source ?? current.source) as BookSource

  const isValidSource = BookSource.safeParse(source).success
  const isValidCategory = BookDetailCategory.safeParse(category).success
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
        const document = hit.document as Hardcover.SearchBook
        const hcBook = HardcoverUtils.parseBookDocument({ document })
        const book: Book = HardcoverUtils.parseBook(hcBook)

        origin = document
        common = book
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

  const params = useMemo(
    () => ({
      slug,
      source,
      category: searchCategory,
    }),
    [searchCategory, slug, source],
  )

  useEffect(() => {
    if (!isValidParams || ctx.isLoading) return

    dispatch(
      setCurrent({
        ...params,
        ...ctx,
      }),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx, isValidParams, params, setCurrent])

  const { isLoading, isNotFound } = current

  const origin = current.origin as SourceOrigin<'hc', 'books'>
  const book = current.common as SearchArtifact<'books'>

  //#endregion  //*======== STATUS ===========
  const StatusIcon = isNotFound ? QuestionMarkCircledIcon : UpdateIcon
  const StatusText = isNotFound ? 'Not Found' : 'Hang on...'
  //#endregion  //*======== STATUS ===========

  //#endregion  //*======== REDIRECTION ===========
  useEffect(() => {
    if (!isValidCategory) {
      return navigate(
        {
          pathname: '/book/:slug?',
        },
        {
          state: {
            source,
          },
          params: {
            slug,
          },
          unstable_viewTransition: true,
        },
      )
    }
    if (!isValidParams) {
      return navigate(
        {
          pathname: '/',
        },
        {
          unstable_viewTransition: true,
        },
      )
    }
  }, [isValidCategory, isValidParams, navigate, slug, source])
  //#endregion  //*======== REDIRECTION ===========

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

      {!!book && (
        <Book book={book!}>
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
              <Book.Image className={cn('h-auto w-32 sm:w-40')} />

              <aside className="flex flex-col gap-1 *:!mt-0">
                {source === BookSource.enum.hc &&
                  (origin?.featured_series?.position ?? 0) >= 1 && (
                    <Badge
                      variant="secondary"
                      className="!mb-2 w-fit"
                    >
                      {`#${origin?.featured_series?.position ?? 1} of ${origin?.featured_series?.series_books_count} in ${origin?.featured_series?.series_name}`}
                    </Badge>
                  )}

                <h1>{book.title}</h1>
                <p>
                  <small className="uppercase text-muted-foreground">by</small>
                  &nbsp;
                  <Link
                    to={{
                      pathname: '/author/:slug?',
                    }}
                    params={{
                      slug: book.author?.slug ?? book?.author?.key ?? '',
                    }}
                    state={{
                      source,
                    }}
                    unstable_viewTransition
                  >
                    <span
                      className={cn(
                        'capitalize',
                        'cursor-pointer underline-offset-4 hover:underline',
                      )}
                    >
                      {book?.author?.name ?? ''}
                    </span>
                  </Link>
                </p>

                <Book.DropdownMenu />
              </aside>
            </div>
          </section>

          <Tabs
            defaultValue={DefaultBookDetailCategory}
            value={category}
            onValueChange={(c) => {
              const isValidCategory = BookDetailCategory.safeParse(c).success
              if (!isValidCategory) return

              const isDefaultCategory = c === DefaultBookDetailCategory
              navigate(
                {
                  pathname: '/book/:slug?/*',
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
              {DisplayBookDetailCategories.options.map((cat) => (
                <TabsTrigger
                  key={`search-tab-${cat}`}
                  value={cat}
                  className={cn(
                    'capitalize',
                    'data-[state=active]:border-primary',
                  )}
                  style={{
                    ...(source == 'hc' &&
                      cat === category && {
                        borderColor: origin?.image?.color,
                      }),
                  }}
                >
                  <span className="h4">{cat}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <Outlet />
          </Tabs>
        </Book>
      )}
    </main>
  )
}

// const BookLayout = () => {
//   const navigate = useNavigate()

//   const { slug = '', '*': category = DefaultBookDetailCategory } =
//     useParams('/book/:slug?/*')
//   const { state } = useLocation()

//   //#endregion  //*======== STORE ===========
//   const dispatch = useRootDispatch()
//   const [current, setCurrent] = [
//     useRootSelector(SearchSelectors.state).current,
//     SearchActions.setCurrent,
//   ]
//   //#endregion  //*======== STORE ===========

//   const searchCategory = SearchCategory.enum.books
//   const source: BookSource = (state?.source ?? current.source) as BookSource

//   const isValidSource = BookSource.safeParse(source).success
//   const isValidCategory = BookDetailCategory.safeParse(category).success
//   const isValidSlug = !!slug.length
//   const isValidParams = isValidSlug && isValidCategory && isValidSource

//   const [currentData, setCurrentData] = useState<CurrentSearchMap>()

//   //#endregion  //*======== SOURCE/HC ===========
//   const { searchExact: hcSearch } = HardcoverEndpoints
//   const hc = hcSearch.useQuery(
//     {
//       category: searchCategory,
//       q: slug,
//     },
//     {
//       skip: !isValidParams || source !== 'hc',
//       selectFromResult: (state) => {
//         const { data, isSuccess } = state

//         const results = data?.results?.[0]
//         const isLoading = state.isLoading || state.isFetching
//         const isNotFound = !isLoading && !isSuccess && (results?.found ?? 0) < 1

//         let origin = undefined
//         let common = undefined

//         const hit = (results?.hits ?? [])?.[0]
//         if (hit) {
//           const document = hit.document as Hardcover.SearchBook
//           const hcBook = HardcoverUtils.parseBookDocument({ document })
//           const book: Book = HardcoverUtils.parseBook(hcBook)

//           origin = document
//           common = book
//         }

//         const currentData: CurrentSourceData = {
//           origin,
//           common,

//           isNotFound,
//           isLoading,
//         }

//         return {
//           ...state,
//           data: currentData,
//         }
//       }
//     },
//   )
//   //#endregion  //*======== SOURCE/HC ===========

//   //   const ctx = useMemo(() => {
//   //   switch (source) {
//   //     case 'hc': {
//   //       return hc
//   //     }
//   //     default: {
//   //       return {
//   //         origin: undefined,
//   //         common: undefined,

//   //         isNotFound: true,
//   //         isLoading: false,
//   //       }
//   //     }
//   //   }
//   // }, [hc, source])

//   // const params = useMemo(() => ({
//   //   slug,
//   //   source,
//   //   category: searchCategory,
//   // }), [searchCategory, slug, source])

//   // useEffect(() => {
//   //   if (!isValidParams) return

//   //   dispatch(
//   //     setCurrent({
//   //       ...params,
//   //       ...ctx,
//   //     }),
//   //   )
//   //   // eslint-disable-next-line react-hooks/exhaustive-deps
//   // }, [ctx, isValidParams, params, setCurrent])

//   const params = useMemo(() => ({
//     slug,
//     source,
//     category: searchCategory,
//   }), [searchCategory, slug, source])
//   const getSourceData = useCallback((source: BookSource) => {
//     let sourceData: CurrentSourceData = {
//       origin: undefined,
//       common: undefined,

//       isNotFound: true,
//       isLoading: false,
//     }
//     switch (source) {
//       case 'hc': {
//         sourceData = hc.data
//         break
//       }
//     }
//     return sourceData

//   }, [hc.data])

//   const ctx = useMemo(() => {
//     const current = {
//       ...params,
//       ...getSourceData(params.source),
//     }
//     logger({ breakpoint: '[_layout.tsx:462]' }, { current })

//     return current
//   }, [getSourceData, params])

//   // const ctx: Sour

//   // useEffect(() => {
//   //   if (!isValidParams) return

//   //   dispatch(setCurrent(ctx))

//   //   // eslint-disable-next-line react-hooks/exhaustive-deps
//   // }, [ctx, isValidParams])

//   return (
//     <main
//       className={cn(
//         'page-container',

//         'flex flex-col gap-8',
//         'place-items-center',
//         '*:w-full',
//       )}
//     >
//       <p>BookLayout</p>
//       <pre>
//         {JSON.stringify({
//           hc: hc.data,
//         }, null, 2)}
//       </pre>
//     </main>
//   )
// }

export default BookLayout
