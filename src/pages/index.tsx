import { Book } from '@/components/Book'
import { List } from '@/components/List'
import { Separator } from '@/components/ui/Separator'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { HardcoverEndpoints } from '@/data/clients/hardcover.api'
import { NYTEndpoints } from '@/data/clients/nyt.api'
import { Link, useNavigate } from '@/router'
import { Hardcover } from '@/types'
import { TrendPeriodTitle } from '@/types/hardcover'
import { HardcoverUtils } from '@/utils/clients/hardcover'
import { NYTUtils } from '@/utils/clients/nyt'
import { cn } from '@/utils/dom'
import { getLimitedArray, getShuffledArray } from '@/utils/helpers'
import { ComponentProps, HTMLAttributes } from 'react'
import Marquee from 'react-fast-marquee'

export const Loader = () => 'Route loader'
export const Action = () => 'Route action'
export const Catch = () => <div>Something went wrong...</div>

export const Pending = () => <div>Loading...</div>

const IndexPage = () => {
  return (
    <main className="page-container my-16 flex flex-col gap-24">
      <section>
        <header className="flex flex-col place-items-center gap-10 *:w-full">
          <h1 className="inline-flex flex-col gap-2">
            <span>Track books you’ve read.</span>
            <span>Save those you want to read.</span>
            <span>
              Tell your friends what’s good{' '}
              <span className="text-muted-foreground">(or don't)</span>.
            </span>
          </h1>
          <Separator />
          {/* <small className='text-center uppercase leading-none tracking-snug text-muted-foreground truncate text-pretty'>The social network for book lovers</small> */}
        </header>

        <div></div>
      </section>

      <TrendingPreview />

      <FeaturedListsPreviewSection />
    </main>
  )
}

export const FeaturedListsPreviewSection = () => {
  const category = Hardcover.ListCategory.enum.featured

  //#endregion  //*======== QUERIES ===========
  const { lists } = HardcoverEndpoints
  const { data } = lists.useQuery({
    category,
  })
  const categoryLists: Hardcover.List[] = (data?.results ??
    []) as Hardcover.List[]
  const displayLimit = 6
  const displayCategoryLists: Hardcover.List[] = getLimitedArray(
    categoryLists,
    displayLimit,
  )
  //#endregion  //*======== QUERIES ===========

  return (
    <section className="flex flex-col gap-8">
      <header>
        <Link
          to={{
            pathname: '/lists',
          }}
          unstable_viewTransition
        >
          <p className="h3 flex-1 cursor-pointer truncate capitalize leading-none tracking-tight">
            Discover Lists ✨
          </p>
        </Link>

        <p className="small font-light normal-case text-muted-foreground">
          Browse our catalogue of user curated lists to find your next read.
        </p>
      </header>

      <section
        className={cn(
          // 'max-h-[80dvh] w-full',
          'w-full',

          'flex flex-col gap-6 lg:grid lg:grid-cols-2',

          'snap-y snap-proximity overflow-y-auto',
        )}
      >
        {displayCategoryLists.map((hcList, idx) => {
          const list: List = HardcoverUtils.parseList(hcList)
          list.books = hcList.books.map((hcBook) =>
            HardcoverUtils.parseBook(hcBook),
          )

          return (
            <List
              list={list!}
              key={`lists-${category}-${idx}-${list.key}`}
            >
              <div className="flex flex-col gap-y-2">
                <h3 className="small line-clamp-1 truncate text-pretty font-semibold uppercase leading-none tracking-tight text-muted-foreground">
                  {list.name}
                </h3>
                <div
                  className={cn(
                    'w-full place-content-start place-items-start gap-2',
                    'flex flex-row flex-wrap',
                    // 'sm:max-w-xl',
                  )}
                >
                  <List.Books>
                    {/* <Book.Thumbnail className="w-fit !rounded-none" /> */}
                  </List.Books>
                </div>
                {/* <Marquee
                  pauseOnHover
                  direction={direction}
                  className={cn(
                    '*:*:flex *:*:flex-row *:*:*:flex *:*:*:flex-row'
                  )}
                >
                  <List.Books>
                    <Book.Thumbnail className="w-fit !rounded-none" />
                  </List.Books>
                </Marquee> */}
              </div>

              {/* <section
                // onClick={onNavigate}
                className={cn(
                  'flex flex-col place-content-start place-items-start gap-4',
                  'w-full border-b py-2',
                )}
              >
                <header className={cn('w-full', 'flex flex-col gap-0.5')}>
                  <div className="flex w-full flex-row flex-wrap place-items-center gap-2">
                    <p className="h4 flex-1 truncate capitalize">
                      {list.name}
                    </p>
                    <Badge variant={'outline'}>
                      {list?.booksCount ?? 0} books
                    </Badge>
                  </div>

                  {list?.description && (
                    <p
                      className={cn(
                        'small font-light normal-case text-muted-foreground',
                        'line-clamp-2 max-w-prose truncate text-pretty',
                      )}
                    >
                      {list.description}
                    </p>
                  )}
                </header>

                <Marquee
                  pauseOnHover
                  className={cn(
                    '*:*:flex *:*:flex-row *:*:*:flex *:*:*:flex-row'
                  )}
                >
                  <List.Books displayLimit={12}>
                    <Book.Thumbnail className="w-fit !rounded-none" />
                  </List.Books>
                </Marquee>
              </section> */}
            </List>
          )
        })}
      </section>
    </section>
  )
}

type TrendingPreviewSection = {
  books: Book[]
  displayLimit?: number
  marquee?: ComponentProps<typeof Marquee>
} & HTMLAttributes<HTMLDivElement>
export const TrendingPreviewSection = ({
  books,
  displayLimit = 12,
  className,
  children,
  marquee,
}: TrendingPreviewSection) => {
  const displayBooks = getLimitedArray(books, displayLimit)
  return (
    <Marquee
      pauseOnHover
      autoFill
      gradient
      gradientColor="hsl(var(--background))"
      className={cn(
        'place-items-start gap-2',
        // 'w-fit place-content-center place-items-start gap-2',
        // 'flex flex-row flex-wrap',

        // 'sm:max-w-xl',
        className,
      )}
      {...marquee}
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
          </Book>
        )
      })}
      {children}
    </Marquee>
  )
}

export const TrendingPreview = () => {
  const navigate = useNavigate()

  const { trending } = HardcoverEndpoints
  const { data, isSuccess } = trending.useQuery(undefined)

  const period = Hardcover.DefaultTrendPeriod

  return (
    <section className="flex flex-col gap-2">
      <header className="flex w-full flex-row flex-wrap place-content-between place-items-end gap-2">
        <aside>
          <Link
            to={{
              pathname: '/trending',
            }}
            unstable_viewTransition
          >
            <p className="h3 flex-1 cursor-pointer truncate capitalize leading-none tracking-tight">
              Trending Now 🤩
            </p>
          </Link>

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
                  '!rounded-none data-[state=active]:border-primary',
                )}
              >
                <span className="small">{title}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </header>
      <Separator />

      <section>
        {Hardcover.TrendPeriod.options.map((period, idx) => {
          const books: Hardcover.Book[] = isSuccess
            ? data?.results?.[period] ?? []
            : []
          const displayBooks = getShuffledArray(
            books.map((book) => HardcoverUtils.parseBook(book)),
          )

          const direction = idx % 2 === 0 ? 'left' : 'right'

          return (
            <TrendingPreviewSection
              key={`trend-${period}`}
              books={displayBooks}
              marquee={{
                direction,
              }}
            />
          )
        })}
      </section>
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
