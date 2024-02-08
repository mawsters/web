import { GoogleEndpoints } from '@/data/clients/google.api'
import { NYTEndpoints } from '@/data/clients/nyt.api'
import { BookOrderMode, BookProjectionMode } from '@/types/books'
import { useState } from 'react'

const IndexPage = () => {
  return (
    <main className="page-container">
      <p>IndexPage</p>
      {/* <NYTBooks /> */}
      {/* <GoogleBooks /> */}
    </main>
  )
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

export const NYTBooks = () => {
  const { booksGetBestsellers } = NYTEndpoints

  const { data } = booksGetBestsellers.useQuery()

  return (
    <div>
      {(data?.results?.lists ?? []).map((list) => (
        <div
          key={`nyt-list-${list.list_id}`}
          className="border"
        >
          <p>{list.list_name}</p>
          <div className="flex flex-row flex-wrap place-items-end gap-5 lg:gap-2">
            {(list.books ?? []).map((book, idx) => (
              <div
                key={`${idx}-${list.list_id}-${book.primary_isbn10 ?? book.primary_isbn13}`}
                className="rounded border"
              >
                <img
                  src={book.book_image}
                  alt={book.title}
                  className="w-32"
                />

                <small>ISBN-10: {book.primary_isbn10}</small>
                <br />
                <small>ISBN-13: {book.primary_isbn13}</small>
                <br />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default IndexPage
