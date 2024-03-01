import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
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
import { useRootSelector } from '@/data/stores/root'
import { UserSelectors } from '@/data/stores/user.slice'
import { useNavigate } from '@/router'
import { Book as BookInfo } from '@/types/shelvd'
import { logger } from '@/utils/debug'
import { cn } from '@/utils/dom'
import { ImageIcon, StackIcon } from '@radix-ui/react-icons'
import { PropsWithChildren, createContext, useContext, useState } from 'react'

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
        pathname: '/books/:slug',
      },
      {
        params: {
          slug: value.book.slug ?? value.book.key,
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

  const getRandomCoverSource = () => {
    const maxCoverIdx = 9
    const idx = Math.floor(Math.random() * maxCoverIdx) + 1
    const coverSrc = `/images/covers/cover-${idx}.png`
    return coverSrc
  }

  return (
    <Avatar
      className={cn(
        'flex place-content-center place-items-center overflow-clip p-0.5',
        '!h-28 !w-auto !max-w-20',
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
              className={cn('h-full w-20', '!rounded-none')}
            />
          )}

          <AvatarFallback
            className={cn(
              '!rounded-none',
              'h-full w-20',
              'flex place-content-center place-items-center',
              'bg-gradient-to-b from-transparent to-background/100',
              isSkeleton && 'animate-pulse',
            )}
          >
            <img
              src={getRandomCoverSource()}
              alt={book.title}
              className={cn(
                'h-full w-20',
                '!rounded-none',
                isSkeleton && 'hidden',
              )}
            />

            <ImageIcon className="h-12 w-12 text-muted-foreground" />
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
            <span className="uppercase">by</span>&nbsp;{book.author}
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
        <DropdownMenuLabel className="small py-0 text-xs text-muted-foreground">
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
//#endregion  //*======== COMPONENTS ===========

export default Book
