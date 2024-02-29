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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/Pagination'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { HardcoverEndpoints } from '@/data/clients/hardcover.api'
import { AppCommandKey } from '@/data/static/app'
import { AppActions, AppSelectors } from '@/data/stores/app.slice'
import { useAppDispatch, useAppSelector } from '@/data/stores/root'
import { useNavigate } from '@/router'
import { Hardcover } from '@/types'
import { HardcoverUtils } from '@/utils/clients/hardcover'
import { logger } from '@/utils/debug'
import { cn } from '@/utils/dom'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { UseFormReturn, useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

const SearchFormSchema = Hardcover.QuerySearchParams.extend({
  category: Hardcover.SearchCategory.default(Hardcover.DefaultSearchCategory),
}).default({
  q: '',
  page: 1,
  category: Hardcover.DefaultSearchCategory,
})

const DefaultSearchQuery: z.infer<typeof SearchFormSchema> =
  SearchFormSchema.parse({})

//#endregion  //*======== CONTEXT ===========
export type SearchContext = {
  form: UseFormReturn<typeof DefaultSearchQuery>
  isNavigatable: boolean
  setIsNavigatable: Dispatch<SetStateAction<boolean>>

  searchQuery: typeof DefaultSearchQuery
  setSearchQuery: Dispatch<SetStateAction<typeof DefaultSearchQuery>>

  onSubmitSearch: () => void
  onResetSearch: () => void
  data?: Hardcover.SearchQueryResponse<
    Hardcover.SearchDocument<Hardcover.SearchCategories>
  >
  dataCount: number

  // isSamePrefix: boolean
  isEmptyQuery: boolean
  isSameQuery: boolean
  isSimilarQuery: boolean
  isLoadingSearch: boolean
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
  defaults?: Partial<typeof DefaultSearchQuery>
}
export const Search = ({ children }: SearchProvider) => {
  const navigate = useNavigate()
  const [, setSearchParams] = useSearchParams()

  //#endregion  //*======== STATES ===========
  const [searchQuery, setSearchQuery] =
    useState<typeof DefaultSearchQuery>(DefaultSearchQuery)
  const [prevSearchQuery, setPrevSearchQuery] =
    useState<typeof searchQuery>(searchQuery)
  const [isNavigatable, setIsNavigatable] = useState<boolean>(false)

  const form = useForm<typeof DefaultSearchQuery>({
    resolver: zodResolver(SearchFormSchema),
    defaultValues: DefaultSearchQuery,
  })

  const onSubmitForm = (values: typeof DefaultSearchQuery) => {
    const isPrevCategory = searchQuery.category === values.category
    values.page = isPrevCategory ? values?.page ?? 1 : 1

    logger(
      { breakpoint: '[Layout.Search.tsx:89]' },
      {
        prev: searchQuery,
        next: values,
      },
      {
        isPrevCategory,
        currPage: values.page,
        nextPage: (values?.page ?? 1) + +isPrevCategory,
      },
    )
    setPrevSearchQuery(searchQuery)
    setSearchQuery(values)

    if (isNavigatable) {
      navigate(
        {
          pathname: '/search/:category',
          search: `?${new URLSearchParams({
            q: values.q,
            type: values.category,
            page: (values.page ?? 1).toString(),
          }).toString()}`,
        },
        {
          params: {
            category: values.category,
          },
          unstable_viewTransition: true,
        },
      )
    }
  }

  const onResetForm = () => {
    setSearchQuery(DefaultSearchQuery)
    setSearchParams(new URLSearchParams({}))
    form.reset()
  }

  //#endregion  //*======== STATES ===========

  const { search } = HardcoverEndpoints
  const { data, isLoading, isFetching } = search.useQuery(searchQuery)

  const dataCount: number = data?.results?.[0]?.found ?? 0

  const isEmptyQuery = !searchQuery.q.length
  const isSameQuery = prevSearchQuery.q === form.getValues().q
  const isSameCategory = prevSearchQuery.category === form.getValues().category
  const isSimilarQuery =
    form.getValues().q.startsWith(searchQuery.q) && isSameCategory

  const isLoadingSearch = isLoading || isFetching

  const onSubmitSearch = () => form.handleSubmit(onSubmitForm)()

  const onResetSearch = () => onResetForm()

  return (
    <SearchContext.Provider
      value={{
        form,
        // query,
        // setQuery,
        // category,
        // setCategory,

        isNavigatable,
        setIsNavigatable,
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
      }}
    >
      <Form {...form}>{children}</Form>
    </SearchContext.Provider>
  )
}

type SearchForm = PropsWithChildren & {
  isNavigatable?: boolean
  defaults?: Partial<typeof DefaultSearchQuery>
}
export const SearchForm = ({
  isNavigatable = false,
  children,
  defaults,
}: SearchForm) => {
  const {
    form,
    onSubmitSearch,

    setIsNavigatable,
  } = useSearchContext()

  useEffect(() => {
    if (!defaults) return

    setIsNavigatable(isNavigatable)
    form.reset(SearchFormSchema.parse(defaults))
    onSubmitSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmitSearch()
      }}
      className="space-y-8"
    >
      <FormField
        control={form.control}
        name="q"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                {...field}
                placeholder="Search for a book, author or character ..."
                onKeyDown={(e) => {
                  const key = e.key.toLowerCase()
                  const isEnter = key === 'Enter'.toLowerCase()

                  if (isEnter) onSubmitSearch()
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {children}
    </form>
  )
}
Search.Form = SearchForm

type SearchCommand = PropsWithChildren
export const SearchCommand = ({ children }: SearchCommand) => {
  const {
    form,
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
          onValueChange={(q) => {
            form.setValue('q', q)
          }}
          onKeyDown={(e) => {
            const key = e.key.toLowerCase()
            const isEnter = key === 'Enter'.toLowerCase()
            if (isEnter) onSubmitSearch()
          }}
          placeholder={'Search for a book, author or character ...'}
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
    form,
    searchQuery,

    data,

    isEmptyQuery,
    isSimilarQuery,
    isLoadingSearch,
  } = useSearchContext()

  const results = data?.results?.[0]
  const { category, q: query } = form.getValues()

  return (
    <>
      {!isEmptyQuery && isSimilarQuery && (
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
                    {book?.title?.split(' ').map((titleText, idx) => (
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
                {artifact?.name?.split(' ').map((titleText, idx) => (
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

type SearchResultsPagination = {
  isNavigatable?: boolean
}
export const SearchResultsPagination = ({
  isNavigatable = false,
}: SearchResultsPagination) => {
  const {
    form,
    data,

    onSubmitSearch,
    setIsNavigatable,

    isSimilarQuery,
  } = useSearchContext()

  const results = data?.results?.[0]

  const resultsThreshold = results?.request_params?.per_page ?? 1
  const resultsFound = results?.found ?? 0

  const currentPage = results?.page ?? 1
  const maxPage = Math.ceil(resultsFound / resultsThreshold)

  const isFirstPage = currentPage === 1
  const pageRange = {
    min: isFirstPage ? currentPage : currentPage - 1,
    mid: isFirstPage ? currentPage + 1 : currentPage,
    max: isFirstPage
      ? currentPage + 2
      : currentPage + 1 <= maxPage
        ? currentPage + 1
        : maxPage,
  }

  const onPageChange = (page: number) => {
    const isValidPage: boolean = page > 0 && page <= maxPage
    if (!isValidPage) return

    const isNextCurrentPage: boolean = page === currentPage
    if (isNextCurrentPage) return

    form.setValue('page', isSimilarQuery ? page ?? 1 : 1)
    setIsNavigatable(isNavigatable)
    onSubmitSearch()
  }

  const onPagePrevious = () => onPageChange(pageRange.min)
  const onPageNext = () => onPageChange(pageRange.max)

  if (maxPage < 2) return null
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={onPagePrevious} />
        </PaginationItem>
        {Object.entries(pageRange).map(([key, page]) => (
          <PaginationItem key={`search-page-${key}`}>
            <PaginationLink
              isActive={page === currentPage}
              onClick={() => {
                onPageChange(page)
              }}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext onClick={onPageNext} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

SearchResults.Pagination = SearchResultsPagination
Search.Pagination = SearchResults.Pagination

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
    form,
    searchQuery,

    data,
    dataCount,

    isEmptyQuery,
    isSimilarQuery,
    isLoadingSearch,
  } = useSearchContext()

  const results = data?.results?.[0]
  const { category, q: query } = form.getValues()

  return (
    <CommandGroup
      className={cn(isLoadingSearch && 'hidden')}
      heading={
        !isEmptyQuery &&
        isSimilarQuery && (
          <h4 className="small font-medium">
            Results for <i>"{searchQuery.q}"</i> in{' '}
            <u className="capitalize">{category}</u>
          </h4>
        )
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
                    {book?.title?.split(' ').map((titleText, idx) => (
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
                {artifact?.name?.split(' ').map((titleText, idx) => (
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

          navigate(
            {
              pathname: '/search/:category',
              search: `?q=${searchQuery.q}`,
            },
            {
              params: {
                category: searchQuery.category,
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
  const { form, onSubmitSearch, setIsNavigatable } = useSearchContext()
  const { category } = form.getValues()

  useEffect(() => {
    setIsNavigatable(isNavigatable)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Tabs
      value={category}
      onValueChange={(c) => {
        const isValidCategory = Hardcover.SearchCategory.safeParse(c).success
        if (!isValidCategory) return

        form.setValue('category', c as typeof category)
        onSubmitSearch()
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
        {Hardcover.SearchCategory.options.map((category) => (
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
