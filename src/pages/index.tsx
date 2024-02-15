import { Card } from '@/components/ui/Card'
import { GoogleEndpoints } from '@/data/clients/google.api'
import { NYTEndpoints } from '@/data/clients/nyt.api'
import { BookOrderMode, BookProjectionMode } from '@/types/google'
import { Book } from '@/types/nyt'
import { cn } from '@/utils/dom'
import { useState } from 'react'


const IndexPage = () => {
  return (
    <main className="page-container">
      <p>IndexPage</p>

      {/** @todo: nyt bestseller section (disabled to prevent rate limit) */}

      {/* <NYTBooks /> */}
      {/* <GoogleBooks /> */}
      <OLBooks />
    </main>
  )
}

{
  /** @todo: refactor */
}
export const OLBooks = () => {
  return <div>OLBooks</div>
}

{
  /** @todo: refactor */
}

export const GoogleBooks = () => {
  const { booksGetVolumes } = GoogleEndpoints

  const [query] = useState<string>('subject:pop')
  const { data } = booksGetVolumes.useQuery({
    q: query,
    orderBy: BookOrderMode.enum.relevance,
    projection: BookProjectionMode.enum.lite,
  })

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}

{
  /** @todo: refactor */
}
export const NYTBooks = () => {
  const { booksGetBestsellers } = NYTEndpoints

  const { data } = booksGetBestsellers.useQuery()

  return (
    <div className="flex flex-col gap-4">
      {(data?.results?.lists ?? []).map((list) => (
        <div
          key={`nyt-list-${list.list_id}`}
          className="border"
        >
          <p>{list.list_name}</p>
          <div className="flex flex-row flex-wrap place-items-end gap-5 lg:gap-2">
            {(list.books ?? []).map((book, idx) => (
              <NYTBookCard
                key={`${idx}-${list.list_id}-${book.primary_isbn10 ?? book.primary_isbn13}`}
                book={book}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

{
  /** @todo: refactor + conform to book search img */
}
export const NYTBookCard = ({ book }: { book: Book }) => {
  return (
    <Card
      className={cn(
        'flex h-40 place-content-center place-items-center p-0.5',
        'hover:bg-primary',
      )}
    >
      <img
        src={book.book_image}
        alt={book.title}
        className="h-full rounded-lg"
      />
    </Card>
  )
}

export default IndexPage
