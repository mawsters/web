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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { OLEndpoints } from '@/data/clients/ol.api'
import { AppCommandKey } from '@/data/static/app'
import { AppActions, AppSelectors } from '@/data/stores/app.slice'
import { useAppDispatch, useAppSelector } from '@/data/stores/root'
import { getBookAuthorsAbbreviation } from '@/utils/clients/ol'
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
import { useCallback, useEffect, useState } from 'react'
import { z } from 'zod'

export const SearchCategory = [`books`, `authors`, 'characters'] as const
export type SearchCategory = (typeof SearchCategory)[number]
export const SearchCategories = z.enum(SearchCategory)

export const SearchPrefix = [`title:`, `author:`, 'person:'] as const
export type SearchPrefix = (typeof SearchPrefix)[number]
export const SearchPrefixes = z.enum(SearchPrefix)

export const SearchCategoryPrefix = new Map<SearchCategory, SearchPrefix>(
  SearchCategories.options.map((category, idx) => [
    category,
    SearchPrefix[idx],
  ]),
)

export function BookSearchCommand() {
  const [query, setQuery] = useState<string>('')
  const [category, setCategory] = useState<SearchCategory>(SearchCategory[0])
  const [searchQuery, setSearchQuery] = useState<string>('')

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

  const { search } = OLEndpoints

  const { data, isLoading, isFetching } = search.useQuery({
    q: searchQuery,
  })

  const onSubmitSearch = () => {
    const prefix = SearchCategoryPrefix.get(category)

    const searchQuery = prefix + query
    setSearchQuery(searchQuery)
  }

  const isSamePrefix =
    `${searchQuery.split(':')?.[0]}:` === SearchCategoryPrefix.get(category)
  const isSameQuery = searchQuery.split(':')?.[1] === query
  const isSimilarQuery = query.startsWith(searchQuery.split(':')?.[1])

  const isLoadingSearch = isLoading || isFetching
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

        <Tabs
          defaultValue={category}
          onValueChange={(category) => setCategory(category as SearchCategory)}
          className={cn('w-full p-3 ')}
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
          </TabsList>
          <TabsContent value="account">
            Make changes to your account here.
          </TabsContent>
          <TabsContent value="password">Change your password here.</TabsContent>
        </Tabs>

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
                        <span>{olBook.title}</span>
                      </CommandItem>
                    </Book>
                  )
                })}
              </CommandGroup>

              <Button className={cn('absolute bottom-0 right-4')}>
                View {data?.numFound ?? 0} results
              </Button>
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
