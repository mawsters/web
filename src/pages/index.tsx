import { GoogleEndpoints } from "@/data/clients/google.api"
import { NYTEndpoints } from "@/data/clients/nyt.api"
import { CounterActions, CounterSelectors } from "@/data/stores/counter.slice"
import { useAppDispatch, useAppSelector } from "@/data/stores/root"
import { BookOrderMode, BookProjectionMode } from "@/types/books"
import { useState } from "react"

const IndexPage = () => {
  return (
    <div>
      <p>IndexPage</p>
      <Counter />

      <NYTBooks />
      {/* <GoogleBooks /> */}
    </div>
  )
}

export const Counter = () => {
  const dispatch = useAppDispatch()
  const { count, status } = useAppSelector(CounterSelectors.state)
  const { increment, decrement } = CounterActions

  return (
    <div>
      <button
        onClick={() => dispatch(increment(1))}
      >
        +
      </button>
      <span>{count} | {status}</span>
      <button
        onClick={() => dispatch(decrement(1))}
      >
        -
      </button>
    </div>
  )
}

export const GoogleBooks = () => {
  const { booksGetVolumes } = GoogleEndpoints

  const [query,] = useState<string>('subject:pop')
  const { data, } = booksGetVolumes.useQuery({
    q: query,
    orderBy: BookOrderMode.enum.relevance,
    projection: BookProjectionMode.enum.lite,
  })

  return (
    <div>
      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>

    </div>
  )
}

export const NYTBooks = () => {
  const { booksGetBestsellers } = NYTEndpoints

  const { data, } = booksGetBestsellers.useQuery()

  return (
    <div>
      {(data?.results?.lists ?? []).map(list => (
        <div key={`nyt-list-${list.list_id}`}
          className="border"
        >
          <p>{list.list_name}</p>
          <div
            className="flex flex-row flex-wrap gap-5 lg:gap-2 place-items-end"
          >
            {(list.books ?? []).map((book, idx) => (
              <div
                key={`${idx}-${list.list_id}-${book.primary_isbn10 ?? book.primary_isbn13}`}
                className="border rounded"
              >
                <img
                  src={book.book_image}
                  alt={book.title}
                  className="w-32"
                />

                <small>ISBN-10: {book.primary_isbn10}</small><br />
                <small>ISBN-13: {book.primary_isbn13}</small><br />
              </div>
            ))}
          </div>
        </div>
      ))}

    </div>
  )
}


export default IndexPage

