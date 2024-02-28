import { Book } from '@/components/Book'
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
import { Hardcover } from '@/types'
import { SearchCategories, SearchCategory } from '@/types/ol'
import { HardcoverUtils } from '@/utils/clients/hardcover'
import { cn } from '@/utils/dom'
import {
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  QuestionMarkCircledIcon,
  UpdateIcon,
} from '@radix-ui/react-icons'
import {
  Dispatch,
  FormEvent,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ClassNameValue } from 'tailwind-merge'

const DefaultSearchQuery: Hardcover.QuerySearchParams & {
  category: Hardcover.SearchCategory
} = {
  q: '',
  page: 1,
  category: Hardcover.DefaultSearchCategory,
}
//#endregion  //*======== CONTEXT ===========
export type BookSearchContext = {
  query: string
  setQuery: Dispatch<SetStateAction<string>>
  category: Hardcover.SearchCategory
  setCategory: Dispatch<SetStateAction<Hardcover.SearchCategory>>
  searchQuery: typeof DefaultSearchQuery
  setSearchQuery: Dispatch<SetStateAction<typeof DefaultSearchQuery>>

  onSubmitSearch: () => void
  data?: Hardcover.SearchQueryResponse<
    Hardcover.SearchDocument<Hardcover.SearchCategory>
  >

  // isSamePrefix: boolean
  isSameQuery: boolean
  isSimilarQuery: boolean
  isLoadingSearch: boolean
  isSearchParam: boolean
}
const BookSearchContext = createContext<BookSearchContext | undefined>(
  undefined,
)
const useBookSearchContext = () => {
  const ctxValue = useContext(BookSearchContext)
  if (ctxValue === undefined) {
    throw new Error(
      'Expected an Context Provider somewhere in the react tree to set context value',
    )
  }
  return ctxValue
}
//#endregion  //*======== CONTEXT ===========

//#endregion  //*======== PROVIDER ===========
type BookSearchProvider = PropsWithChildren & {
  showSearchParams?: boolean
  defaults?: {
    query: string
    category?: SearchCategory
  }
}
export const BookSearch = ({
  children,
  showSearchParams = false,
  defaults,
}: BookSearchProvider) => {
  const [, setSearchParams] = useSearchParams()

  const [query, setQuery] = useState<string>(defaults?.query ?? '')
  const [category, setCategory] = useState<Hardcover.SearchCategory>(
    DefaultSearchQuery.category,
  )
  const [searchQuery, setSearchQuery] =
    useState<typeof DefaultSearchQuery>(DefaultSearchQuery)

  //#endregion  //*======== QUERIES ===========
  // const { search } = OLEndpoints
  const { search } = HardcoverEndpoints
  const { data, isLoading, isFetching } = search.useQuery(searchQuery)

  const onSubmitSearch = () => {
    const searchQueryParams: typeof searchQuery = {
      q: query,
      page: 1,
      category,
    }
    setSearchQuery(searchQueryParams)

    if (showSearchParams) {
      setSearchParams(
        new URLSearchParams({
          q: query,
          type: category,
        }),
      )
    }
  }
  //#endregion  //*======== QUERIES ===========

  // const isSamePrefix =
  //   `${searchQuery.split(':')?.[0]}:` === SearchCategoryPrefix.get(category)
  const isSameQuery = searchQuery.q === query
  const isSimilarQuery = query.startsWith(searchQuery.q)

  const isLoadingSearch = isLoading || isFetching

  return (
    <BookSearchContext.Provider
      value={{
        query,
        setQuery,
        category,
        setCategory,
        searchQuery,
        setSearchQuery,

        data,
        onSubmitSearch,

        // isSamePrefix,
        isSameQuery,
        isSimilarQuery,
        isLoadingSearch,
        isSearchParam: showSearchParams,
      }}
    >
      {children}
    </BookSearchContext.Provider>
  )
}
//#endregion  //*======== PROVIDER ===========

//#endregion  //*======== COMPONENTS ===========

export const BookSearchResults = () => {
  const { query, searchQuery, data } = useBookSearchContext()

  const results = data?.results?.[0]

  const isBooks = searchQuery.category === Hardcover.SearchCategories.enum.books
  const isAuthors =
    searchQuery.category === Hardcover.SearchCategories.enum.authors

  return (
    (results?.found ?? 0) > 0 && (
      <>
        <p>{`Results for "${searchQuery.q}" in ${searchQuery.category}`}</p>
        {(results?.hits ?? []).map((hit, idx) => {
          if (!hit) return

          if (isBooks) {
            const hcBook = HardcoverUtils.parseBookDocument({ hit })
            const book: Book = HardcoverUtils.parseBook(hcBook)

            return (
              <Book
                key={`${book.source}-${idx}-${book.key}`}
                book={book!}
              >
                <div className={cn('flex flex-row place-items-center gap-8')}>
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
                </div>
              </Book>
            )
          } else if (isAuthors) {
            const hcAuthor = HardcoverUtils.parseAuthorDocument({ hit })
            const author = HardcoverUtils.parseAuthor(hcAuthor)

            return (
              <div
                key={`${author.source}-${idx}-${author.key}`}
                className={cn('flex flex-row place-items-center gap-8')}
              >
                <p>
                  {author.name.split(' ').map((titleText, idx) => (
                    <span
                      key={`${author.key}-title-${idx}`}
                      className={cn(
                        query.toLowerCase().includes(titleText.toLowerCase()) &&
                          'text-yellow-500',
                      )}
                    >
                      {titleText}&nbsp;
                    </span>
                  ))}
                </p>
                <small>{author.bookCount}</small>
              </div>
            )
          }
        })}
      </>
    )
  )
}
BookSearch.Results = BookSearchResults

export const BookSearchPagination = () => {
  const { data } = useBookSearchContext()

  const results = data?.results?.[0]

  const currentPage = results?.page ?? 1
  const maxPage = results?.out_of ?? 1

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

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        {Object.entries(pageRange).map(([key, page]) => (
          <PaginationItem>
            <PaginationLink
              href={`#${page}`}
              isActive={key == 'mid'}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

BookSearch.Pagination = BookSearchPagination

type BookSearchCategoryTabs = PropsWithChildren & {
  className?: ClassNameValue
}
export const BookSearchCategoryTabs = ({
  children,
  className,
}: BookSearchCategoryTabs) => {
  const { category, setCategory } = useBookSearchContext()

  return (
    <Tabs
      defaultValue={category}
      onValueChange={(category) => setCategory(category as SearchCategory)}
      className={cn('w-full py-4', className)}
    >
      <TabsList
        className={cn(
          '!h-auto !rounded-none border-b !bg-transparent !px-0 pb-0',
          '[&>*]:rounded-b-none [&>*]:border-b [&>*]:!bg-transparent [&>*]:transition-all',
          'flex w-full flex-row !place-content-start place-items-center',
        )}
      >
        {SearchCategories.options.map((category) => (
          <TabsTrigger
            key={`search-tab-${category}`}
            value={category}
            className={cn('capitalize', 'data-[state=active]:border-white')}
          >
            {category}
          </TabsTrigger>
        ))}

        {children}
      </TabsList>
    </Tabs>
  )
}
BookSearch.CategoryTabs = BookSearchCategoryTabs

export const BookSearchForm = () => {
  const {
    query,
    setQuery,
    //   category,
    //   setCategory,
    //   searchQuery,

    //   data,
    onSubmitSearch,

    //   isSamePrefix,
    //   isSameQuery,
    //   isSimilarQuery,
    //   isLoadingSearch,
  } = useBookSearchContext()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmitSearch()
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="search"
        placeholder="Search for a book, author or character ..."
        value={query}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setQuery(event.target.value)
        }}
      />
      <BookSearch.CategoryTabs />
    </form>
  )
}
BookSearch.Form = BookSearchForm

//#endregion  //*======== COMPONENTS ===========

export function BookSearchCommand() {
  const {
    query,
    setQuery,
    category,
    searchQuery,

    data,
    onSubmitSearch,

    // isSamePrefix,
    isSameQuery,
    isSimilarQuery,
    isLoadingSearch,
  } = useBookSearchContext()

  //#endregion  //*======== DIALOG ===========
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
  //#endregion  //*======== DIALOG ===========

  const results = data?.results?.[0]
  return (
    <>
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

        <BookSearch.CategoryTabs className="p-3" />

        <CommandList>
          {isLoadingSearch && (
            <CommandLoading className="text-muted-foreground [&>div]:flex [&>div]:w-full [&>div]:flex-row [&>div]:place-content-center [&>div]:place-items-center [&>div]:gap-2">
              <UpdateIcon className="h-4 w-4 animate-spin" />
              <span>Hang on…</span>
            </CommandLoading>
          )}

          {(results?.found ?? 0) > 0 && (
            <>
              <CommandGroup
                heading={`Results for "${searchQuery.q}" in ${searchQuery.category}`}
              >
                {searchQuery.category ===
                  Hardcover.SearchCategories.enum.books &&
                  (results?.hits ?? []).map((hit, idx) => {
                    if (!hit) return

                    const document = hit.document
                    const image = document.image.url
                    const pubYear = +document.release_year
                    const author = document?.author_names?.[0] ?? '???'

                    const hcBook: Hardcover.Book = {
                      ...document,
                      author,
                      pubYear,
                      image,
                    }

                    const book: Book = HardcoverUtils.parseBook(hcBook)

                    return (
                      <Book
                        key={`${book.source}-${idx}-${book.key}`}
                        book={book!}
                      >
                        <CommandItem
                          value={book.title}
                          className={cn(
                            'flex flex-row place-items-center gap-8',
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
                    )
                  })}
              </CommandGroup>

              <Link
                to={`/search?q=${query}&category=${category}`}
                unstable_viewTransition
              >
                <Button
                  className={cn('absolute bottom-4 right-4')}
                  onClick={() => {
                    toggleVisibility()

                    const route = `/search?q=${query}&category=${category}`
                    navigate(route, {
                      unstable_viewTransition: true,
                    })
                  }}
                >
                  View {results?.found ?? 0} results
                </Button>
              </Link>
            </>
          )}

          <CommandEmpty>
            {!isLoadingSearch &&
              (isSameQuery || isSimilarQuery ? (
                !data ? (
                  'No results found.'
                ) : (
                  <>
                    <Button className={cn('absolute bottom-0 right-4')}>
                      View {results?.found ?? 0} results
                    </Button>
                  </>
                )
              ) : (
                'Searching ....'
              ))}

            {/** @todo: remove */}
            <pre className="text-start">
              {JSON.stringify(
                {
                  state: {
                    // isSamePrefix,
                    isSameQuery,
                    isSimilarQuery,
                  },
                  params: {
                    category,
                    // prefix: SearchCategoryPrefix.get(category),
                    query,
                  },
                  data: results?.found ?? 0,
                },
                null,
                2,
              )}
            </pre>
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
        </CommandList>
      </CommandDialog>
    </>
  )
}

BookSearch.Command = BookSearchCommand

export default BookSearch
