import Book, { Author, Character, List } from '@/components/Book'
import { Button } from '@/components/ui/Button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
} from '@/components/ui/Command'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { HardcoverEndpoints } from '@/data/clients/hardcover'
import { AppCommandKey } from '@/data/static/app'
import { AppActions, AppSelectors } from '@/data/stores/app.slice'
import { useAppDispatch, useAppSelector } from '@/data/stores/root'
import { useNavigate } from '@/router'
import { Hardcover } from '@/types'
import { HardcoverUtils } from '@/utils/clients/hardcover'
import { logger } from '@/utils/debug'
import { cn } from '@/utils/dom'
import {
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  QuestionMarkCircledIcon,
  UpdateIcon,
} from '@radix-ui/react-icons'
import {
  Dispatch,
  Fragment,
  HTMLAttributes,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useSearchParams } from 'react-router-dom'

const DefaultSearchQuery: Hardcover.QuerySearchParams & {
  category: Hardcover.SearchCategory
} = {
  q: '',
  page: 1,
  category: Hardcover.DefaultSearchCategory,
}

//#endregion  //*======== CONTEXT ===========
export type SearchContext = {
  query: string
  setQuery: Dispatch<SetStateAction<string>>

  category: Hardcover.SearchCategory
  setCategory: Dispatch<SetStateAction<Hardcover.SearchCategory>>

  searchQuery: typeof DefaultSearchQuery
  setSearchQuery: Dispatch<SetStateAction<typeof DefaultSearchQuery>>

  onSubmitSearch: () => void
  onResetSearch: () => void
  data?: Hardcover.SearchQueryResponse<
    Hardcover.SearchDocument<Hardcover.SearchCategory>
  >
  dataCount: number

  // isSamePrefix: boolean
  isEmptyQuery: boolean
  isSameQuery: boolean
  isSimilarQuery: boolean
  isLoadingSearch: boolean
  isSearchParam: boolean
}
const SearchContext = createContext<SearchContext | undefined>(undefined)
const useSearchContext = () => {
  const ctxValue = useContext(SearchContext)
  if (ctxValue === undefined) {
    throw new Error(
      'Expected an Context Provider somewhere in the react tree to set context value',
    )
  }
  return ctxValue
}
//#endregion  //*======== CONTEXT ===========

type SearchProvider = PropsWithChildren & {
  showSearchParams?: boolean
  defaults?: Partial<typeof DefaultSearchQuery>
}
export const Search = ({
  defaults = DefaultSearchQuery,
  showSearchParams = false,

  children,
}: SearchProvider) => {
  const [, setSearchParams] = useSearchParams()

  //#endregion  //*======== STATES ===========
  const [query, setQuery] = useState<string>(
    defaults?.q ?? DefaultSearchQuery.q,
  )
  const [category, setCategory] = useState<Hardcover.SearchCategory>(
    defaults?.category ?? DefaultSearchQuery.category,
  )
  const [searchQuery, setSearchQuery] = useState<typeof DefaultSearchQuery>({
    ...DefaultSearchQuery,
    ...defaults,
  })
  //#endregion  //*======== STATES ===========

  //#endregion  //*======== HELPERS ===========
  const onSubmitSearch = () => {
    const searchQueryParams: typeof searchQuery = {
      q: query,
      page: 1,
      category,
    }

    logger({ breakpoint: '[Layout.Search.tsx:89]' }, { searchQueryParams })
    setSearchQuery(searchQueryParams)

    if (showSearchParams) {
      setSearchParams(
        new URLSearchParams({
          q: searchQueryParams.q,
          type: searchQueryParams.category,
        }),
      )
    }
  }
  const onResetSearch = () => {
    const searchDefaults: typeof searchQuery = {
      ...DefaultSearchQuery,
      ...defaults,
    }

    setQuery(searchDefaults.q)
    setCategory(searchDefaults.category)
    setSearchQuery(searchDefaults)

    setSearchParams(new URLSearchParams({}))
  }
  //#endregion  //*======== HELPERS ===========

  const { search } = HardcoverEndpoints
  const { data, isLoading, isFetching } = search.useQuery({
    ...searchQuery,
    category,
  })

  const dataCount: number = data?.results?.[0]?.found ?? 0

  const isEmptyQuery = !searchQuery.q.length
  const isSameQuery = searchQuery.q === query
  const isSimilarQuery = query.startsWith(searchQuery.q)

  const isLoadingSearch = isLoading || isFetching

  return (
    <SearchContext.Provider
      value={{
        query,
        setQuery,
        category,
        setCategory,
        searchQuery,
        setSearchQuery,

        data,
        dataCount,

        onSubmitSearch,
        onResetSearch,

        isEmptyQuery,
        isSameQuery,
        isSimilarQuery,
        isLoadingSearch,
        isSearchParam: showSearchParams,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

type SearchCommand = PropsWithChildren
export const SearchCommand = ({ children }: SearchCommand) => {
  const {
    query,
    setQuery,

    dataCount,
    onSubmitSearch,

    isEmptyQuery,
    isLoadingSearch,
  } = useSearchContext()

  const dispatch = useAppDispatch()
  const [isVisible, setIsVisible] = [
    useAppSelector(AppSelectors.state).menuVisibility,
    AppActions.setMenuVisibility,
  ]

  return (
    <>
      <SearchCommand.Trigger />

      <CommandDialog
        open={isVisible}
        onOpenChange={(visibility) => {
          dispatch(setIsVisible(visibility))
        }}
      >
        <CommandInput
          placeholder="Type a command or search..."
          value={query}
          onValueChange={setQuery}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSubmitSearch()
          }}
        />

        <SearchCommand.Tabs />
        <CommandList>
          <SearchCommand.Loading />

          <SearchCommand.Results />

          <CommandEmpty className={cn(isEmptyQuery && 'hidden')}>
            {!dataCount && <p>No results found.</p>}

            {isLoadingSearch && <p>Searching ....</p>}
          </CommandEmpty>

          <CommandGroup heading="WIP">
            <CommandItem>
              <ExclamationTriangleIcon className="mr-2 h-4 w-4" />
              <span>Work in Progress</span>
            </CommandItem>
            <CommandItem>
              <QuestionMarkCircledIcon className="mr-2 h-4 w-4" />
              <span>
                Press&nbsp;
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">Enter</span>
                </kbd>
                &nbsp; to search
              </span>
            </CommandItem>
          </CommandGroup>

          {children}
        </CommandList>
      </CommandDialog>
    </>
  )
}

Search.Command = SearchCommand

type SearchResultItem = HTMLAttributes<HTMLDivElement> & {
  asChild?: boolean
}
export const SearchResultItem = ({
  asChild = false,
  children,
  className,
  ...rest
}: SearchResultItem) => {
  if (asChild) {
    return <Fragment {...rest}>{children}</Fragment>
  }
  return (
    <div
      className={cn('flex w-full flex-row place-items-center gap-8', className)}
      {...rest}
    >
      {children}
    </div>
  )
}

Search.ResultItem = SearchResultItem
SearchCommand.ResultItem = Search.ResultItem

export const SearchResults = () => {
  const navigate = useNavigate()

  const {
    query,
    category,
    searchQuery,

    data,

    isEmptyQuery,
    isLoadingSearch,
  } = useSearchContext()

  const results = data?.results?.[0]

  return (
    <>
      {!isEmptyQuery && (
        <h4 className="small font-medium">
          Results for <i>"{searchQuery.q}"</i> in{' '}
          <u className="capitalize">{category}</u>
        </h4>
      )}

      <main className={cn(isLoadingSearch && 'hidden')}>
        {(results?.hits ?? []).map((hit, idx) => {
          if (!hit) return
          if (category === 'books') {
            const book = HardcoverUtils.parseDocument({ category, hit }) as Book
            return (
              <SearchCommand.ResultItem
                key={`${book.source}-${idx}-${book.key}`}
                onClick={() => {
                  navigate(
                    {
                      pathname: '/books/:slug',
                    },
                    {
                      params: {
                        slug: book.slug ?? book.key,
                      },
                      unstable_viewTransition: true,
                    },
                  )
                }}
              >
                <Book book={book!}>
                  <Book.Image />
                  <p>
                    {book.title.split(' ').map((titleText, idx) => (
                      <span
                        key={`${book.key}-title-${idx}`}
                        className={cn(
                          query
                            .toLowerCase()
                            .includes(titleText.toLowerCase()) &&
                            'text-yellow-500',
                        )}
                      >
                        {titleText}&nbsp;
                      </span>
                    ))}
                  </p>
                </Book>
              </SearchCommand.ResultItem>
            )
          }

          const artifact = HardcoverUtils.parseDocument({ category, hit }) as
            | Author
            | Character
            | List
          return (
            <SearchCommand.ResultItem
              key={`${artifact.source}-${idx}-${artifact.key}`}
            >
              <p>
                {artifact.name.split(' ').map((titleText, idx) => (
                  <span
                    key={`${artifact.key}-title-${idx}`}
                    className={cn(
                      query.toLowerCase().includes(titleText.toLowerCase()) &&
                        'text-yellow-500',
                    )}
                  >
                    {titleText}&nbsp;
                  </span>
                ))}
              </p>
              <small>{+(artifact.bookCount ?? 0)}</small>
            </SearchCommand.ResultItem>
          )
        })}
      </main>
    </>
  )
}
Search.Results = SearchResults

export const SearchCommandResults = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [isVisible, setIsVisible] = [
    useAppSelector(AppSelectors.state).menuVisibility,
    AppActions.setMenuVisibility,
  ]

  const toggleVisibility = useCallback(() => {
    const visibility = !isVisible
    dispatch(setIsVisible(visibility))
  }, [dispatch, isVisible, setIsVisible])

  const {
    query,
    category,
    searchQuery,

    data,
    dataCount,
    onResetSearch,

    isLoadingSearch,
  } = useSearchContext()

  const results = data?.results?.[0]

  return (
    <CommandGroup
      className={cn(isLoadingSearch && 'hidden')}
      heading={
        <h4 className="small font-medium">
          Results for <i>"{searchQuery.q}"</i> in{' '}
          <u className="capitalize">{category}</u>
        </h4>
      }
    >
      {(results?.hits ?? []).map((hit, idx) => {
        if (!hit) return

        if (category === 'books') {
          const book = HardcoverUtils.parseDocument({ category, hit }) as Book
          return (
            <SearchCommand.ResultItem
              key={`${book.source}-${idx}-${book.key}`}
              asChild
            >
              <Book book={book!}>
                <CommandItem
                  value={book.title}
                  className={cn(
                    'flex w-full flex-row place-items-center gap-8',
                  )}
                >
                  <Book.Image />
                  <p>
                    {book.title.split(' ').map((titleText, idx) => (
                      <span
                        key={`${book.key}-title-${idx}`}
                        className={cn(
                          query
                            .toLowerCase()
                            .includes(titleText.toLowerCase()) &&
                            'text-yellow-500',
                        )}
                      >
                        {titleText}&nbsp;
                      </span>
                    ))}
                  </p>
                </CommandItem>
              </Book>
            </SearchCommand.ResultItem>
          )
        }

        const artifact = HardcoverUtils.parseDocument({ category, hit }) as
          | Author
          | Character
          | List
        return (
          <SearchCommand.ResultItem
            key={`${artifact.source}-${idx}-${artifact.key}`}
          >
            <CommandItem
              value={artifact.name}
              className={cn('flex w-full flex-row place-items-center gap-8')}
            >
              <p>
                {artifact.name.split(' ').map((titleText, idx) => (
                  <span
                    key={`${artifact.key}-title-${idx}`}
                    className={cn(
                      query.toLowerCase().includes(titleText.toLowerCase()) &&
                        'text-yellow-500',
                    )}
                  >
                    {titleText}&nbsp;
                  </span>
                ))}
              </p>
              <small>{+(artifact.bookCount ?? 0)}</small>
            </CommandItem>
          </SearchCommand.ResultItem>
        )
      })}

      <Button
        className={cn('absolute bottom-4 right-4 z-40')}
        onClick={() => {
          toggleVisibility()
          onResetSearch()
          navigate(
            {
              pathname: '/search/:category',
              search: `?q=${searchQuery.q}&page=${searchQuery.page}`,
            },
            {
              params: {
                category: Hardcover.DefaultSearchCategory,
              },
              unstable_viewTransition: true,
            },
          )
        }}
      >
        View {dataCount} results
      </Button>
    </CommandGroup>
  )
}
SearchCommand.Results = SearchCommandResults

export const SearchCommandTrigger = () => {
  const dispatch = useAppDispatch()
  const [isVisible, setIsVisible] = [
    useAppSelector(AppSelectors.state).menuVisibility,
    AppActions.setMenuVisibility,
  ]

  const toggleVisibility = useCallback(() => {
    const visibility = !isVisible
    dispatch(setIsVisible(visibility))
  }, [dispatch, isVisible, setIsVisible])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === AppCommandKey && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        toggleVisibility()
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [dispatch, isVisible, setIsVisible, toggleVisibility])

  return (
    <div
      onClick={toggleVisibility}
      className={cn(
        'hidden flex-row place-content-between place-items-center gap-4 sm:flex',
        'h-9 w-64',
        'rounded-md border border-input bg-transparent px-3 py-1 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',

        'text-sm text-muted-foreground',
      )}
    >
      <aside className="inline-flex flex-row place-items-center gap-1">
        <MagnifyingGlassIcon className="h-4 w-4" />
        <span>Quick Search</span>
      </aside>

      <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
        <span className="text-xs">⌘</span>
        {AppCommandKey.toUpperCase()}
      </kbd>
    </div>
  )
}

SearchCommand.Trigger = SearchCommandTrigger

export const SearchCommandLoading = () => {
  const { isLoadingSearch } = useSearchContext()

  if (!isLoadingSearch) return
  return (
    <CommandLoading className="text-muted-foreground [&>div]:flex [&>div]:w-full [&>div]:flex-row [&>div]:place-content-center [&>div]:place-items-center [&>div]:gap-2">
      <UpdateIcon className="h-4 w-4 animate-spin" />
      <span>Hang on…</span>
    </CommandLoading>
  )
}
SearchCommand.Loading = SearchCommandLoading

//#endregion  //*======== UNIVERSAL ===========

type SearchTabs = HTMLAttributes<HTMLDivElement> & {
  isNavigatable?: boolean
}
export const SearchTabs = ({
  isNavigatable = false,
  children,
  className,
}: SearchTabs) => {
  const navigate = useNavigate()

  const { category, setCategory, onSubmitSearch } = useSearchContext()
  return (
    <Tabs
      defaultValue={category}
      value={category}
      onValueChange={(c) => {
        const isValidCategory = Hardcover.SearchCategories.safeParse(c).success
        if (!isValidCategory) return

        setCategory(c as typeof category)
        onSubmitSearch()

        if (isNavigatable) {
          navigate(
            {
              pathname: '/search/:category',
            },
            {
              params: {
                category: c,
              },
              unstable_viewTransition: true,
            },
          )
        }
      }}
      className={cn('w-full py-4', className)}
    >
      <TabsList
        className={cn(
          '!h-auto !rounded-none border-b !bg-transparent pb-0',
          '[&>*]:rounded-b-none [&>*]:border-b [&>*]:!bg-transparent [&>*]:transition-all',
          'flex w-full flex-row !place-content-start place-items-center gap-x-4',

          'overflow-x-auto',
        )}
      >
        {Hardcover.SearchCategories.options.map((category) => (
          <TabsTrigger
            key={`search-tab-${category}`}
            value={category}
            className={cn('capitalize', 'data-[state=active]:border-white')}
          >
            {category}
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  )
}
Search.Tabs = SearchTabs
SearchCommand.Tabs = Search.Tabs

//#endregion  //*======== UNIVERSAL ===========
export default Search
