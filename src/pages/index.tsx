import { Book } from '@/components/Book'
import { Separator } from '@/components/ui/Separator'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { HardcoverEndpoints } from '@/data/clients/hardcover.api'
import { NYTEndpoints } from '@/data/clients/nyt.api'
import { AppName } from '@/data/static/app'
import { useNavigate } from '@/router'
import { Hardcover } from '@/types'
import { TrendPeriodTitle } from '@/types/hardcover'
import { HardcoverUtils } from '@/utils/clients/hardcover'
import { NYTUtils } from '@/utils/clients/nyt'
import { cn } from '@/utils/dom'
import { getLimitedArray } from '@/utils/helpers'
import { HTMLAttributes } from 'react'

export const Loader = () => 'Route loader'
export const Action = () => 'Route action'
export const Catch = () => <div>Something went wrong...</div>

export const Pending = () => <div>Loading...</div>

const IndexPage = () => {
  return (
    <main className="page-container">
      <TrendingPreivew />

      {/* <TrendingPreivewBestsellers /> */}
    </main>
  )
}

type TrendingPreviewSection = {
  books: Book[]
  displayLimit?: number
} & HTMLAttributes<HTMLDivElement>
export const TrendingPreviewSection = ({
  books,
  displayLimit = 12,
  className,
  children,
  ...rest
}: TrendingPreviewSection) => {
  const displayBooks = getLimitedArray(books, displayLimit)
  return (
    <section
      className={cn(
        'w-fit place-content-center place-items-start gap-2',
        'flex flex-row flex-wrap',

        'sm:max-w-xl',
        className,
      )}
      {...rest}
    >
      {displayBooks.map((book, idx) => {
        return (
          <Book
            key={`${book.source}-${idx}-${book.key}`}
            book={book!}
          >
            <Book.Thumbnail
              className={cn(
                'w-fit !rounded-none',
                idx > 8 && 'hidden sm:block',
              )}
            />

            <Book.DropdownMenu />
          </Book>
        )
      })}
      {children}
    </section>
  )
}

export const TrendingPreivew = () => {
  const navigate = useNavigate()

  const { trending } = HardcoverEndpoints
  const { data, isSuccess } = trending.useQuery(undefined)

  const period = Hardcover.DefaultTrendPeriod
  const books: Hardcover.Book[] = isSuccess ? data?.results?.[period] ?? [] : []
  const displayBooks = books.map((book) => HardcoverUtils.parseBook(book))

  return (
    <section className="flex flex-col gap-2">
      <header className="flex w-full flex-row flex-wrap place-content-between place-items-end gap-2">
        <aside>
          <h3 className="small font-semibold uppercase leading-none tracking-tight text-muted-foreground">
            Trending on {AppName}
          </h3>

          <p className="small font-light normal-case text-muted-foreground">
            Here are a few books that have been read the most in the{' '}
            {Hardcover.TrendPeriodTitle[period].toLowerCase()}.
          </p>
        </aside>

        <Tabs
          defaultValue={period}
          onValueChange={(pd) => {
            const isDefaultPeriod = pd === period
            if (isDefaultPeriod) return

            navigate(
              {
                pathname: '/trending/:period',
              },
              {
                params: {
                  period: pd,
                },
                unstable_viewTransition: true,
              },
            )
          }}
          className="hidden w-fit lg:block"
        >
          <TabsList className="!h-fit">
            {Object.entries(TrendPeriodTitle).map(([period, title]) => (
              <TabsTrigger
                key={`trending-tab-${period}`}
                value={period}
                className={cn(
                  'capitalize',
                  '!rounded-none data-[state=active]:border-white',
                )}
              >
                <span className="small">{title}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </header>
      <Separator />
      <TrendingPreviewSection books={displayBooks} />
    </section>
  )
}

export const TrendingPreivewBestsellers = () => {
  const { booksGetBestsellerLists } = NYTEndpoints
  const { data } = booksGetBestsellerLists.useQuery()

  const books = getLimitedArray(data?.results?.lists ?? [], 2).flatMap(
    (list) => list.books ?? [],
  )

  const displayBooks: Book[] = books.map((book) => NYTUtils.parseBook(book))

  return (
    <div className="flex flex-col gap-2">
      <h3 className="small font-semibold uppercase leading-none tracking-tight text-muted-foreground">
        New York Times' Bestsellers
      </h3>
      <Separator />

      <TrendingPreviewSection books={displayBooks} />
    </div>
  )
}

export default IndexPage
