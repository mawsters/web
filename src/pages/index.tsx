import { Book } from '@/components/Book'
import { Separator } from '@/components/ui/Separator'
import { NYTEndpoints } from '@/data/clients/nyt.api'
import { cn } from '@/utils/dom'
import { getLimitedArray } from '@/utils/helpers'

export const Loader = () => 'Route loader'
export const Action = () => 'Route action'
export const Catch = () => <div>Something went wrong...</div>

export const Pending = () => <div>Loading...</div>

const IndexPage = () => {
  return (
    <main className="page-container">
      <NYTBooks />
    </main>
  )
}

export const NYTBooks = () => {
  const { booksGetBestsellerLists } = NYTEndpoints

  const { data } = booksGetBestsellerLists.useQuery()

  const booksBestsellers = getLimitedArray(
    data?.results?.lists ?? [],
    2,
  ).flatMap((list) => list.books ?? [])

  return (
    <div className="flex flex-col gap-2">
      <h3 className="small font-semibold uppercase leading-none tracking-tight text-muted-foreground">
        New York Times' Bestsellers
      </h3>
      <Separator />

      <div
        className={cn(
          'grid w-fit place-content-center place-items-start gap-2',
          'grid-cols-3 sm:grid-cols-6 lg:grid-flow-col',
        )}
      >
        {booksBestsellers.map((nytBook, idx) => {
          const book: Book = {
            key: nytBook.primary_isbn10 ?? nytBook.primary_isbn13,
            title: nytBook.title,
            author: nytBook.author,
            image: nytBook.book_image,
            source: 'nyt',
          }
          return (
            <Book
              key={book.key}
              book={book!}
            >
              <Book.Thumbnail
                className={cn(
                  idx >= 9 && 'hidden',
                  idx >= 6 && 'hidden lg:block',
                )}
              />
            </Book>
          )
        })}
      </div>
    </div>
  )
}

export default IndexPage
