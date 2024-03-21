import Book from '@/components/Book'
import { HardcoverEndpoints } from '@/data/clients/hardcover.api'
import { useNavigate } from '@/router'
import { ListData, List as ListInfo } from '@/types/shelvd'
import { HardcoverUtils } from '@/utils/clients/hardcover'
import { ShelvdUtils } from '@/utils/clients/shelvd'
import { logger } from '@/utils/debug'
import { cn } from '@/utils/dom'
import { getLimitedArray } from '@/utils/helpers'
import { PropsWithChildren, createContext, useContext, useMemo } from 'react'

export type List = ListInfo

//#endregion  //*======== CONTEXT ===========
type ListContext = {
  data: ListData
  list: List
  // overwriteList?: List
  overwriteBooks?: Book[]
  isSkeleton?: boolean
  onNavigate: () => void
}
const ListContext = createContext<ListContext | undefined>(undefined)
const useListContext = () => {
  const ctxValue = useContext(ListContext)
  if (ctxValue === undefined) {
    throw new Error(
      'Expected an Context Provider somewhere in the react tree to set context value',
    )
  }
  return ctxValue
}
//#endregion  //*======== CONTEXT ===========

//#endregion  //*======== PROVIDER ===========
type ListProvider = PropsWithChildren & Omit<ListContext, 'onNavigate' | 'list'>
export const List = ({ children, overwriteBooks, ...value }: ListProvider) => {
  // const navigate = useNavigate()

  const bookKeys: string[] = overwriteBooks ? [] : value?.data?.bookKeys ?? []
  const { searchExactBulk: hcSearchBulk } = HardcoverEndpoints
  const hcSearchBookKeys = hcSearchBulk.useQuery(
    bookKeys.map((key) => ({
      category: 'books',
      q: key,
    })),
    {
      skip: !bookKeys.length,
    },
  )

  const books: Book[] = useMemo(() => {
    const { data, isSuccess } = hcSearchBookKeys

    const results = data?.results ?? []
    const isLoading = hcSearchBookKeys.isLoading || hcSearchBookKeys.isFetching
    const isNotFound = !isLoading && !isSuccess && results.length < 1
    if (isNotFound) return []

    const books: Book[] = results.map((result) => {
      // exact search expects top hit accuracy
      const hit = (result?.hits ?? [])?.[0]
      const book = HardcoverUtils.parseDocument({
        category: 'books',
        hit,
      }) as Book
      return book
    })
    return books
  }, [hcSearchBookKeys])

  const onNavigate = () => {
    if (!value?.data) return
    // navigate(
    //   {
    //     pathname: '/list/:slug?',
    //   },
    //   {
    //     state: {
    //       source: value.list.source,
    //     },
    //     params: {
    //       slug: value.list?.slug ?? value.list.key,
    //     },
    //     unstable_viewTransition: true,
    //   },
    // )
  }

  const list: List = ListInfo.parse({
    ...value.data,
    books: overwriteBooks ?? books,
  })
  logger(
    { breakpoint: '[List.tsx:89]/ListProvider' },
    { value, overwriteBooks, list, bookKeys },
  )
  return (
    <ListContext.Provider
      value={{
        isSkeleton: !(Object.keys(value?.data ?? {}) ?? []).length,
        onNavigate,
        ...value,
        list,
      }}
    >
      {children}
    </ListContext.Provider>
  )
}
//#endregion  //*======== PROVIDER ===========

//#endregion  //*======== COMPONENTS ===========

type ListBooks = PropsWithChildren & {
  displayLimit?: number
}
const ListBooks = ({ displayLimit, children }: ListBooks) => {
  const {
    list: { books, key, source },
  } = useListContext()

  const navigate = useNavigate()

  const displayBooks = displayLimit
    ? getLimitedArray(books, displayLimit)
    : books
  if (!displayBooks.length) return null
  return displayBooks.map((book, idx) => (
    <Book
      key={`${key}-${source}-${idx}-${book.key}`}
      book={book!}
    >
      {children ?? (
        <div
          onClick={() => {
            navigate(
              {
                pathname: '/book/:slug',
              },
              {
                state: {
                  source: book.source,
                },
                params: {
                  slug: book.slug ?? book.key,
                },
                unstable_viewTransition: true,
              },
            )
          }}
          className={cn(
            'flex flex-row place-content-start place-items-start gap-4',
            'w-full border-b py-2',
          )}
        >
          <small className="whitespace-nowrap	"># {idx + 1}</small>
          <Book.Thumbnail className="w-fit !rounded-none" />

          <aside>
            <p className="h4 line-clamp-3 truncate text-pretty capitalize">
              {book.title}
            </p>
            <p className="!m-0 capitalize text-muted-foreground">
              <small className="font-semibold uppercase">by</small>&nbsp;
              {ShelvdUtils.printAuthorName(book.author.name, {
                mandatoryNames: [book.author.name],
              })}
            </p>
          </aside>
        </div>
      )}
    </Book>
  ))
}
List.Books = ListBooks

//#endregion  //*======== COMPONENTS ===========

export default List
