import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import { Card } from '@/components/ui/Card'
import {
  HoverCard,
  HoverCardArrow,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/Hover.Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/utils/dom'
import { ImageIcon } from '@radix-ui/react-icons'
import { PropsWithChildren, createContext, useContext } from 'react'
import { z } from 'zod'

export const BookSources = [`ol`, `nyt`, `google`, `hc`] as const
export const BookSource = z.enum(BookSources)
export type BookSource = z.infer<typeof BookSource>

export type Book = {
  key: string
  title: string
  author: string
  image?: string
  source: BookSource
}

//#endregion  //*======== CONTEXT ===========
export type BookContext = {
  book: Book
  isSkeleton?: boolean
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
type BookProvider = PropsWithChildren & BookContext
export const Book = ({ children, ...value }: BookProvider) => (
  <BookContext.Provider
    value={{ ...value, isSkeleton: !Object.keys(value?.book ?? {}).length }}
  >
    {children}
  </BookContext.Provider>
)
//#endregion  //*======== PROVIDER ===========

//#endregion  //*======== COMPONENTS ===========

type BookImage = Avatar
export const BookImage = ({ className, children, ...rest }: BookImage) => {
  const { book, isSkeleton } = useBookContext()

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
              className={cn(
                'h-full w-20',
                // "rounded-lg",
              )}
            />
          )}

          <AvatarFallback
            className={cn(
              // 'rounded-lg',
              'h-full w-20',
              'flex place-content-center place-items-center',
              'bg-gradient-to-b from-transparent to-background/100',
              isSkeleton && 'animate-pulse',
            )}
          >
            <ImageIcon
              className={cn(
                'h-12 w-12 text-muted-foreground',
                isSkeleton && 'hidden',
              )}
            />
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
  const { book, isSkeleton } = useBookContext()

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

//#endregion  //*======== COMPONENTS ===========

export default Book
