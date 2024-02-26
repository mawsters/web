import Book from '@/components/Book'
import { HardcoverEndpoints } from '@/data/clients/hardcover'
import { useParams } from '@/router'
import { Hardcover } from '@/types'
import { HardcoverUtils } from '@/utils/clients/hardcover'
import { getLimitedArray } from '@/utils/helpers'
import { QuestionMarkCircledIcon, UpdateIcon } from '@radix-ui/react-icons'

const BookPage = () => {
  const { slug } = useParams('/books/:slug')

  const { search } = HardcoverEndpoints
  const { data, isLoading, isFetching } = search.useQuery({
    category: 'books',
    q: slug,
  })

  const results = data?.results?.[0]
  const dataCount: number = results?.found ?? 0
  const isNotFound = dataCount < 1
  // const isNotSole = dataCount > 1

  const isLoadingBook = isLoading || isFetching

  return (
    <main>
      {isLoadingBook && (
        <div className="flex w-full flex-row place-content-center place-items-center gap-2 text-muted-foreground">
          <UpdateIcon className="h-4 w-4 animate-spin" />
          <span>Hang on…</span>
        </div>
      )}

      {!isLoadingBook && isNotFound && (
        <div className="flex w-full flex-row place-content-center place-items-center gap-2 text-muted-foreground">
          <QuestionMarkCircledIcon className="h-4 w-4 animate-spin" />
          <span>Book Not Found</span>
        </div>
      )}

      {getLimitedArray(results?.hits ?? [], 1).map((hit) => {
        const document = hit.document as Hardcover.SearchBook

        const hcBook = HardcoverUtils.parseBookDocument({ hit })
        const book: Book = HardcoverUtils.parseBook(hcBook)

        return (
          <Book
            book={book}
            key={`${book.source}-${book.key}`}
          >
            <Book.Image />

            <p>{book.title}</p>
            <p>by {book.author}</p>

            <article>{document.description}</article>
            <pre>
              {JSON.stringify(
                {
                  book,
                },
                null,
                2,
              )}
            </pre>
          </Book>
        )
      })}
    </main>
  )
}

export default BookPage
