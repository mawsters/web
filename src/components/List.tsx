import Book from '@/components/Book'
import { useNavigate } from '@/router'
import { List as ListInfo } from '@/types/shelvd'
import { ShelvdUtils } from '@/utils/clients/shelvd'
import { cn } from '@/utils/dom'
import { getLimitedArray } from '@/utils/helpers'
import { PropsWithChildren, createContext, useContext } from 'react'

export type List = ListInfo

//#endregion  //*======== CONTEXT ===========
type ListContext = {
  list: List
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
type ListProvider = PropsWithChildren & Omit<ListContext, 'onNavigate'>
export const List = ({ children, ...value }: ListProvider) => {
  // const navigate = useNavigate()

  const onNavigate = () => {
    if (!value?.list) return
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

  return (
    <ListContext.Provider
      value={{
        isSkeleton: !Object.keys(value?.list ?? {}).length,
        onNavigate,
        ...value,
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
