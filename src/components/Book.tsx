import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import { Badge, BadgeProps } from '@/components/ui/Badge'
import { Button, ButtonProps } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Checkbox } from '@/components/ui/Checkbox'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/Command'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/Dropdown-Menu'
import {
  HoverCard,
  HoverCardArrow,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/Hover.Card'
import { Skeleton } from '@/components/ui/Skeleton'
import {
  useGetCollectionsQuery,
  useUpdateCollectionMutation,
} from '@/data/clients/collections.api'
import { HardcoverEndpoints } from '@/data/clients/hardcover.api'
import { useRootSelector } from '@/data/stores/root'
import { UserSelectors } from '@/data/stores/user.slice'
import { useNavigate } from '@/router'
import { CollectionQueryResponse } from '@/types/collections'
import { Book as BookInfo, Series } from '@/types/shelvd'
import { HardcoverUtils } from '@/utils/clients/hardcover'
import { logger } from '@/utils/debug'
import { cn } from '@/utils/dom'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  StackIcon,
} from '@radix-ui/react-icons'
import {
  HTMLAttributes,
  PropsWithChildren,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
export type Book = BookInfo
//#endregion  //*======== CONTEXT ===========
export type BookContext = {
  book: Book
  isSkeleton?: boolean
  onNavigate: () => void
}
const BookContext = createContext<BookContext | undefined>(undefined)
const useBookContext = () => {
  const ctxValue = useContext(BookContext)
  if (ctxValue === undefined) {
    throw new Error(
      'Expected an Context Provider somewhere in the react tree to set context value',
    )
  }
  return ctxValue
}
//#endregion  //*======== CONTEXT ===========

//#endregion  //*======== PROVIDER ===========
type BookProvider = PropsWithChildren & Omit<BookContext, 'onNavigate'>
export const Book = ({ children, ...value }: BookProvider) => {
  const navigate = useNavigate()

  const onNavigate = () => {
    if (!value.book) return
    navigate(
      {
        pathname: '/book/:slug?',
      },
      {
        state: {
          source: value.book.source,
        },
        params: {
          slug: value.book?.slug ?? value.book.key,
        },
        unstable_viewTransition: true,
      },
    )
  }

  return (
    <BookContext.Provider
      value={{
        isSkeleton: !Object.keys(value?.book ?? {}).length,
        onNavigate,
        ...value,
      }}
    >
      {children}
    </BookContext.Provider>
  )
}

//#endregion  //*======== PROVIDER ===========

//#endregion  //*======== COMPONENTS ===========

type BookImage = Avatar
export const BookImage = ({ className, children, ...rest }: BookImage) => {
  const { book, isSkeleton } = useBookContext()

  const getRandomCoverSource = (idx: number = 0) => {
    const maxCoverIdx = 9
    if (!idx) idx = Math.floor(Math.random() * maxCoverIdx) + 1
    const coverSrc = `/images/covers/cover-${idx}.png`
    return coverSrc
  }

  return (
    <Avatar
      className={cn(
        'flex place-content-center place-items-center overflow-clip p-0.5',
        'aspect-[3/4.5] min-h-28 min-w-20',
        // '!h-28 !w-auto !max-w-20',
        '!rounded-none hover:bg-primary',
        // 'rounded-lg',
        className,
      )}
      {...rest}
    >
      {children ?? (
        <>
          {!isSkeleton && (
            <AvatarImage
              src={book.image}
              alt={book.title}
              className={cn(
                'h-full w-full',
                // 'h-full w-20',
                '!rounded-none',
              )}
            />
          )}

          <AvatarFallback
            className={cn(
              'relative',
              '!rounded-none',
              'h-full w-full',
              // 'h-full w-20',
              'flex place-content-center place-items-center',
              'bg-gradient-to-b from-transparent to-background/100',
              isSkeleton && 'animate-pulse',
            )}
          >
            <img
              src={getRandomCoverSource()}
              alt={book.title}
              className={cn(
                'h-full w-full',
                // 'h-full w-20',
                '!rounded-none',
              )}
            />

            <span
              className={cn(
                'absolute inset-x-1 bottom-1',
                'h4 line-clamp-2 truncate text-pretty text-sm capitalize leading-tight tracking-tighter',
                'text-muted-foreground brightness-50 invert',
              )}
            >
              {book.title}
            </span>
          </AvatarFallback>
        </>
      )}
    </Avatar>
  )
}
Book.Image = BookImage

type BookThumbnail = Card
export const BookThumbnail = ({
  className,
  children,
  ...rest
}: BookThumbnail) => {
  const { book, isSkeleton, onNavigate } = useBookContext()

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Card
          className={cn(
            'flex place-content-center place-items-center',
            'hover:bg-primary',
            'shrink-0',
            className,
          )}
          onClick={onNavigate}
          {...rest}
        >
          {children}
          <Book.Image />
        </Card>
      </HoverCardTrigger>
      <HoverCardContent
        side="top"
        sideOffset={5}
        className={cn('flex flex-col gap-2', 'bg-secondary', 'w-fit py-2')}
      >
        <HoverCardArrow className="fill-secondary" />
        {isSkeleton ? (
          <Skeleton className="h-4 w-[100px]" />
        ) : (
          <small className="text-sm leading-none">
            <small className="capitalize">{book.title.toLowerCase()}</small>
          </small>
        )}

        {isSkeleton ? (
          <Skeleton className="h-4 w-[100px]" />
        ) : (
          <small className="capitalize text-muted-foreground">
            <span className="uppercase">by</span>&nbsp;{book.author.name}
          </small>
        )}
      </HoverCardContent>
    </HoverCard>
  )
}
Book.Thumbnail = BookThumbnail

type BookDropdown = PropsWithChildren & {
  button?: ButtonProps
}
export const BookDropdown = ({ button, children }: BookDropdown) => {
  const { book } = useBookContext()

  // get from slice
  const lists = useRootSelector(UserSelectors.state).lists

  const coreLists = lists?.core ?? []
  const createdLists = lists?.created ?? []

  /**
   * Core list: mutex
   * @description
   * A book in already in any Core list, cannot be in another
   */
  const [coreListId, setCoreListId] = useState<string>()

  /**
   * Created list
   * @description
   * A book in already in any Created list, can be in another
   */
  const [createdListIds, setCreatedListIds] = useState<Set<string>>(
    new Set<string>([]),
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="default"
          size="icon"
          {...button}
        >
          <StackIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="small py-0 text-xs capitalize text-muted-foreground">
          {book.title}
        </DropdownMenuLabel>

        {!!coreLists.length && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={coreListId}
              onValueChange={setCoreListId}
            >
              {coreLists.map((list) => (
                <DropdownMenuRadioItem
                  key={`book-${book.key}-collection-core-${list.key}`}
                  value={list.key}
                >
                  {list.name}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </>
        )}

        {!!createdLists.length && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Add to list</DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="p-0">
                <Command>
                  <CommandInput
                    placeholder="Filter label..."
                    autoFocus={true}
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>No label found.</CommandEmpty>
                    <CommandGroup>
                      {createdLists.map((list) => (
                        <CommandItem
                          key={`book-${book.key}-collection-user-${list.key}`}
                          value={list.key}
                          onSelect={(id) => {
                            const listIds = new Set(createdListIds)
                            const isAdded = listIds.has(id)

                            if (!isAdded) {
                              listIds.add(id)
                            } else {
                              listIds.delete(id)
                            }

                            setCreatedListIds(listIds)

                            logger(
                              { breakpoint: '[Book.tsx:344]' },
                              { id, toAdd: !isAdded, listIds, createdListIds },
                            )
                          }}
                          className="flex flex-row place-items-center gap-2"
                        >
                          <Checkbox
                            id={list.key}
                            checked={createdListIds.has(list.key)}
                          />
                          {list.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </>
        )}

        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

Book.DropdownMenu = BookDropdown

export const BookDropdownMock = ({ button, children }: BookDropdown) => {
  const { book } = useBookContext();

  // State management
  const [coreListId, setCoreListId] = useState<string>();
  const [createdListIds, setCreatedListIds] = useState<Set<string>>(() => {
    const storedListIds = localStorage.getItem('createdListIds');
    return storedListIds ? new Set(JSON.parse(storedListIds)) : new Set();
  });
  useEffect(() => {
    localStorage.setItem('createdListIds', JSON.stringify(Array.from(createdListIds)));
  }, [createdListIds]);
  
  // Fetch and Filter Collections
  const { data, isLoading, isError } = useGetCollectionsQuery();
  const [updateCollection] = useUpdateCollectionMutation();

  if (isLoading || isError) {
    logger({ breakpoint: '[Book.tsx:394]' }, 'Loading or Error');
    return null;
  }
  // Helper Functions
  const isCoreCollection = (collection: CollectionQueryResponse) =>
    ['To Read', 'Reading', 'Completed'].includes(collection.title);

  const isCreatedCollection = (collection: CollectionQueryResponse) =>
    !isCoreCollection(collection);

  const coreLists = data!.filter(isCoreCollection);
  const createdLists = data!.filter(isCreatedCollection);

  // Adding Book to Created Lists
  const handleAddBookToCreatedList = (isAdded: boolean, id: string) => {
    const collection = createdLists.find((c) => c.id === id);
    if (!collection) return; 

    const { booklist } = collection;
    const updatedBookList = isAdded
      ? booklist.filter((booklistBook) => booklistBook.key !== book.key)
      : [...booklist, book];

    updateCollection({ id, params: { booklist: updatedBookList } });
  };

  // Dropdown Render Logic
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" size="icon" {...button}>
          <StackIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
      <DropdownMenuLabel className="small py-0 text-xs capitalize text-muted-foreground">
          {book.title}
        </DropdownMenuLabel>

        {!!coreLists.length && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={coreListId}
              onValueChange={setCoreListId}
            >
              {coreLists.map((list) => (
                <DropdownMenuRadioItem
                  key={`book-${book.key}-collection-core-${list.id}`}
                  value={list.id}
                >
                  {list.title}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </>
        )}

        {!!createdLists.length && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Add to list</DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="p-0">
                <Command>
                  <CommandInput
                    placeholder="Filter label..."
                    autoFocus={true}
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>No label found.</CommandEmpty>
                    <CommandGroup>
                      {createdLists.map((list) => (
                        <CommandItem
                          key={`book-${book.key}-collection-user-${list.id}`}
                          value={list.id}
                          onSelect={(id) => {
                            const listIds = new Set(createdListIds)
                            const isAdded = listIds.has(id)
                            logger(
                              { breakpoint: '[Book.tsx:523]' },
                              'Triggered onSelect',
                            )
                            handleAddBookToCreatedList(isAdded, id)

                            if (!isAdded) {
                              listIds.add(id)
                            } else {
                              listIds.delete(id)
                            }

                            setCreatedListIds(listIds)

                            logger(
                              { breakpoint: '[Book.tsx:344]' },
                              { id, toAdd: !isAdded, listIds, createdListIds },
                            )
                          }}
                          className="flex flex-row place-items-center gap-2"
                        >
                          <Checkbox
                            id={list.id}
                            checked={createdListIds.has(list.id)}
                          />
                          {list.title}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </>
        )}

        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

Book.DropdownMenuMock = BookDropdownMock

type BookTags = HTMLAttributes<HTMLDivElement> & {
  title: ReactNode
  tags: string[]

  tag?: BadgeProps

  header?: HTMLAttributes<HTMLDivElement>
}
export const BookTags = ({
  title,
  tags,
  children,
  className,

  tag: { className: tagClsx, ...tagProps } = { className: '' },
  ...rest
}: BookTags) => {
  const { isSkeleton = !tags.length } = useBookContext()

  const [showAllTags, setShowAllTags] = useState<boolean>(false)

  const allTags: string[] = isSkeleton ? new Array(5).fill(false) : tags
  const tagsPreviewThreshold = 5
  const isTagsLong = allTags.length > tagsPreviewThreshold

  const TagChevron = showAllTags ? ChevronUpIcon : ChevronDownIcon
  if (!allTags.length) return null
  return (
    <section
      className={cn('flex flex-1 flex-col gap-2 md:w-min', className)}
      {...rest}
    >
      <header className="flex flex-row place-content-between place-items-center gap-2">
        {typeof title === 'string' ? <h4>{title}</h4> : title}
        {isTagsLong && (
          <Button
            variant="link"
            onClick={() => setShowAllTags(!showAllTags)}
            className="flex text-xs text-muted-foreground !no-underline sm:hidden lg:flex"
          >
            <TagChevron className="size-4" />
            {showAllTags ? 'Collapse' : 'Expand'}
          </Button>
        )}
      </header>
      <aside className="flex flex-row flex-wrap place-items-center gap-2">
        {allTags.map((tag, idx) =>
          isSkeleton ? (
            <Skeleton
              key={`game-tag-${idx}`}
              className="h-5 w-[100px]"
            />
          ) : (
            <Badge
              key={`game-tag-${idx}`}
              variant="secondary"
              className={cn(
                'truncate text-xs capitalize',
                idx + 1 > tagsPreviewThreshold &&
                  (showAllTags ? 'block' : 'hidden sm:block lg:hidden'),
                tagClsx,
              )}
              {...tagProps}
            >
              {tag}
            </Badge>
          ),
        )}
      </aside>
      {children}
    </section>
  )
}
Book.Tags = BookTags

type BookDescription = HTMLAttributes<HTMLDivElement>
export const BookDescription = ({
  className,
  children,
  ...rest
}: BookDescription) => {
  const { book } = useBookContext()

  const description = book.description ?? ''
  const isEmptyDescription = !description.length
  const [showFullDesc, setShowFullDesc] = useState<boolean>(isEmptyDescription)

  return (
    <article
      className={cn(
        'flex flex-col place-content-between',
        'overflow-hidden',

        className,
      )}
      {...rest}
    >
      <p
        className={cn(
          'p whitespace-break-spaces text-pretty font-sans',
          'relative flex-1',
          !showFullDesc &&
            'masked-overflow masked-overflow-top line-clamp-4 !overflow-y-hidden',
          isEmptyDescription && 'italic text-muted-foreground',
        )}
      >
        {isEmptyDescription
          ? "We don't have a description for this book yet."
          : description}
      </p>

      {children}

      <Button
        variant="secondary"
        onClick={() => setShowFullDesc(!showFullDesc)}
        className={cn(
          'flex w-full flex-row place-content-center place-items-center gap-2',
          'rounded-t-none',
          showFullDesc && 'hidden',
        )}
      >
        <ChevronDownIcon className="size-4" />
        <span>See More</span>
      </Button>
    </article>
  )
}
Book.Description = BookDescription

type BookSeries = HTMLAttributes<HTMLDivElement>
export const BookSeries = ({ className, children, ...rest }: BookSeries) => {
  const { book } = useBookContext()

  const isInSeries = !!(book?.series?.key ?? book?.series?.slug)
  const [titles, setTitles] = useState<string[]>([])

  // #endregion  //*======== SOURCE/HC ===========
  const { searchExact: hcSearch, searchExactBulk: hcSearchBulk } =
    HardcoverEndpoints
  const hcSearchSeriesTitles = hcSearchBulk.useQuery(
    titles.map((title) => ({
      category: 'books',
      q: title,
    })),
    {
      skip: book.source !== 'hc' || !isInSeries || !titles.length,
    },
  )

  const hcSearchSeries = hcSearch.useQuery(
    {
      category: 'series',
      q: book?.series?.slug ?? '', // hc uses slug
    },
    {
      skip: book.source !== 'hc' || !isInSeries,
    },
  )

  const hcSeries = useMemo(() => {
    const { data, isSuccess } = hcSearchSeries

    const results = data?.results?.[0]
    const isLoading = hcSearchSeries.isLoading || hcSearchSeries.isFetching
    const isNotFound = !isLoading && !isSuccess && (results?.found ?? 0) < 1
    if (isNotFound) return

    const hit = (results?.hits ?? [])?.[0]
    return HardcoverUtils.parseDocument({ category: 'series', hit }) as Series
  }, [hcSearchSeries])

  // #endregion  //*======== SOURCE/HC ===========

  const series = useMemo(() => {
    let series = undefined
    switch (book.source) {
      case 'hc': {
        series = hcSeries
      }
    }

    if (series) {
      setTitles(series.titles ?? [])
      logger({ breakpoint: '[Book.tsx:525]/BookSeries' }, { series })
    }

    return series
  }, [book.source, hcSeries])

  if (!isInSeries || !series) return null
  return (
    <section
      className={cn('flex flex-col gap-2', className)}
      {...rest}
    >
      <header>
        <h4>
          <span className="capitalize">Series: </span>
          <span
            className={cn(
              'cursor-pointer underline-offset-4 hover:underline',
              ' leading-none tracking-tight text-muted-foreground',
            )}
          >
            {series.name}
          </span>
        </h4>
      </header>
      <div
        className={cn(
          'w-full place-content-start place-items-start gap-2',
          'flex flex-row flex-wrap',
        )}
      >
        {(hcSearchSeriesTitles.data?.results ?? []).map((result, idx) => {
          const hit = (result?.hits ?? [])?.[0]
          if (!hit) return null

          const seriesBook = HardcoverUtils.parseDocument({
            category: 'books',
            hit,
          }) as Book
          if (!seriesBook) return

          const isCurrentBook = seriesBook.key == book.key
          return (
            <Book
              key={`${seriesBook.source}-${idx}-${seriesBook.key}`}
              book={seriesBook!}
            >
              <Book.Thumbnail
                className={cn(
                  'w-fit !rounded-none',
                  idx > 8 && 'hidden sm:block',
                  isCurrentBook && 'border-primary',
                )}
              />
            </Book>
          )
        })}
      </div>

      {children}
    </section>
  )
}
Book.Series = BookSeries

// type BookEditions = HTMLAttributes<HTMLDivElement>
// const BookEditions = ({
//   children,
//   className,
//   ...rest
// }: BookEditions) => {
//   const { book } = useBookContext()

//   //#endregion  //*======== SOURCE/HC ===========
//   const { getEditionsById } = HardcoverEndpoints
//   const hcEditionsQuery = getEditionsById.useQuery({
//     id: +(book.key) ?? 0,
//   }, {
//     skip: (book.source !== 'hc'),
//   })

//   const hcEditions = useMemo(() => {
//     const { data } = hcEditionsQuery

//     const editions = data?.data?.editions ?? []
//     return editions
//   }, [hcEditionsQuery])

//   //#endregion  //*======== SOURCE/HC ===========

//   const editions = useMemo(() => {
//     let editions = []
//     switch (book.source) {
//       case 'hc': {
//         editions = hcEditions
//       }
//     }

//     if (editions.length) {
//       logger({ breakpoint: '[Book.tsx:616]/BookEditions' }, { editions })
//     }

//     return editions
//   }, [book.source, hcEditions])
//   if (!editions.length) return null

//   return (
//     <section className={cn("flex flex-col gap-2", className)} {...rest}>

//       <pre>
//         {JSON.stringify({
//           book,
//           editions,
//         }, null, 2)}
//       </pre>
//       {/* <div
//         className={cn(
//           'w-full place-content-start place-items-start gap-2',
//           'flex flex-row flex-wrap',
//         )}
//       >
//         {(hcSearchSeriesTitles.data?.results ?? []).map((result, idx) => {
//           const hit = (result?.hits ?? [])?.[0]
//           if (!hit) return null

//           const seriesBook = HardcoverUtils.parseDocument({ category: 'books', hit }) as Book
//           if (!seriesBook) return

//           const isCurrentBook = seriesBook.key == book.key
//           return (
//             <Book
//               key={`${seriesBook.source}-${idx}-${seriesBook.key}`}
//               book={seriesBook!}
//             >
//               <Book.Thumbnail
//                 className={cn(
//                   'w-fit !rounded-none',
//                   idx > 8 && 'hidden sm:block',
//                   isCurrentBook && 'border-primary'
//                 )}
//               />
//             </Book>
//           )
//         })}
//       </div> */}

//       {children}
//     </section>
//   )
// }
// Book.Editions = BookEditions

export default Book
