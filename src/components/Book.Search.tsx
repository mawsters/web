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
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/Command'
import { Input } from '@/components/ui/Input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { OLEndpoints } from '@/data/clients/ol.api'
import { AppCommandKey } from '@/data/static/app'
import { AppActions, AppSelectors } from '@/data/stores/app.slice'
import { useAppDispatch, useAppSelector } from '@/data/stores/root'
import {
  SearchCategories,
  SearchCategory,
  SearchCategoryPrefix,
  SearchQueryResponse,
} from '@/types/ol'
import { getBookAuthorsAbbreviation, getSearchQuery } from '@/utils/clients/ol'
import { logger } from '@/utils/debug'
import { cn } from '@/utils/dom'
import {
  CalendarIcon,
  EnvelopeClosedIcon,
  FaceIcon,
  GearIcon,
  MagnifyingGlassIcon,
  PersonIcon,
  RocketIcon,
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

//#endregion  //*======== CONTEXT ===========
export type BookSearchContext = {
  query: string
  setQuery: Dispatch<SetStateAction<string>>
  category: SearchCategory
  setCategory: Dispatch<SetStateAction<SearchCategory>>
  searchQuery: string
  setSearchQuery: Dispatch<SetStateAction<string>>

  onSubmitSearch: () => void
  data?: SearchQueryResponse

  isSamePrefix: boolean
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
  const [category, setCategory] = useState<SearchCategory>(
    defaults?.category ?? SearchCategory[0],
  )
  const [searchQuery, setSearchQuery] = useState<string>(
    defaults ? getSearchQuery(defaults) : '',
  )

  //#endregion  //*======== QUERIES ===========
  const { search } = OLEndpoints

  const { data, isLoading, isFetching } = search.useQuery({
    q: searchQuery,
  })

  const onSubmitSearch = () => {
    const searchQuery = getSearchQuery({
      query,
      category,
    })
    setSearchQuery(searchQuery)

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

  const isSamePrefix =
    `${searchQuery.split(':')?.[0]}:` === SearchCategoryPrefix.get(category)
  const isSameQuery = searchQuery.split(':')?.[1] === query
  const isSimilarQuery = query.startsWith(searchQuery.split(':')?.[1])

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

        isSamePrefix,
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

  return (
    (data?.numFound ?? 0) > 0 && (
      <>
        <p>{`Results for "${searchQuery.split(':')?.[1]}"`}</p>
        <div>
          {(data?.docs ?? []).map((olBook) => {
            const book: Book = {
              ...olBook,
              author: getBookAuthorsAbbreviation(olBook),
              image: olBook.cover_i
                ? `https://covers.openlibrary.org/b/id/${olBook.cover_i}-M.jpg`
                : undefined,
              source: 'ol',
            }

            logger(
              { breakpoint: '[Book.Search.tsx:182]' },
              {
                title: book.title,
                queryMatch: olBook.title.split(query),
              },
            )
            return (
              <Book
                key={olBook.key}
                book={book!}
              >
                <div className={cn('flex flex-row place-items-center gap-8')}>
                  <Book.Image />
                  <p>
                    {olBook.title.split(' ').map((titleText, idx) => (
                      <span
                        key={`${olBook.key}-title-${idx}`}
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
          })}
        </div>
      </>
    )
  )
}
BookSearch.Results = BookSearchResults

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
          'border-b !bg-transparent pb-0',
          '[&>*]:rounded-b-none [&>*]:border-b [&>*]:!bg-transparent [&>*]:transition-all',
          'flex w-full flex-row !place-content-start place-items-center',
        )}
      >
        {SearchCategories.options.map((category) => (
          <TabsTrigger
            key={`tab-${category}`}
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

    isSamePrefix,
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

          {(data?.numFound ?? 0) > 0 && (
            <>
              <CommandGroup
                heading={`Results for "${searchQuery.split(':')?.[1]}"`}
              >
                {(data?.docs ?? []).map((olBook) => {
                  const book: Book = {
                    ...olBook,
                    author: getBookAuthorsAbbreviation(olBook),
                    image: `https://covers.openlibrary.org/b/id/${olBook.cover_i}-M.jpg`,
                    source: 'ol',
                  }

                  logger(
                    { breakpoint: '[Book.Search.tsx:182]' },
                    {
                      title: book.title,
                      queryMatch: olBook.title.split(query),
                    },
                  )
                  return (
                    <Book
                      key={olBook.key}
                      book={book!}
                    >
                      <CommandItem
                        value={olBook.title}
                        className={cn('flex flex-row place-items-center gap-8')}
                      >
                        <Book.Image />
                        <p>
                          {olBook.title.split(' ').map((titleText, idx) => (
                            <span
                              key={`${olBook.key}-title-${idx}`}
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
                  View {data?.numFound ?? 0} results
                </Button>
              </Link>
            </>
          )}

          <CommandEmpty>
            {!isLoadingSearch &&
              ((isSamePrefix && isSameQuery) || isSimilarQuery ? (
                !data ? (
                  'No results found.'
                ) : (
                  <>
                    <Button className={cn('absolute bottom-0 right-4')}>
                      View {data?.numFound ?? 0} results
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
                    isSamePrefix,
                    isSameQuery,
                    isSimilarQuery,
                  },
                  params: {
                    category,
                    prefix: SearchCategoryPrefix.get(category),
                    query,
                  },
                  data: data?.numFound,
                },
                null,
                2,
              )}
            </pre>
          </CommandEmpty>

          {/** @todo: populate with suggestions */}
          <CommandGroup heading="Suggestions">
            <CommandItem>
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>Calendar</span>
            </CommandItem>
            <CommandItem>
              <FaceIcon className="mr-2 h-4 w-4" />
              <span>Search Emoji</span>
            </CommandItem>
            <CommandItem>
              <RocketIcon className="mr-2 h-4 w-4" />
              <span>Launch</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              <PersonIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <EnvelopeClosedIcon className="mr-2 h-4 w-4" />
              <span>Mail</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <GearIcon className="mr-2 h-4 w-4" />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}

BookSearch.Command = BookSearchCommand

export default BookSearch
