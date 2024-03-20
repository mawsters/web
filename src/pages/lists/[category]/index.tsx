import Book from '@/components/Book'
import { List } from '@/components/List'
import { Badge } from '@/components/ui/Badge'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/Pagination'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { HardcoverEndpoints } from '@/data/clients/hardcover.api'
import { useNavigate, useParams } from '@/router'
import { Hardcover } from '@/types'
import { HardcoverUtils } from '@/utils/clients/hardcover'
import { cn } from '@/utils/dom'
import { getRangedArray, getSegmentedArray } from '@/utils/helpers'
import { useEffect, useState } from 'react'

const ListCategoryPage = () => {
  const navigate = useNavigate()

  const { category = Hardcover.DefaultListCategory } =
    useParams('/lists/:category')

  const isValidCategory = Hardcover.ListCategory.safeParse(category).success
  // const searchCategory = SearchCategory.enum.lists

  // exit: invalid params
  useEffect(() => {
    if (!isValidCategory) {
      navigate(
        {
          pathname: '/lists',
        },
        {},
      )
    }
  }, [isValidCategory, navigate])

  // //#endregion  //*======== STORE ===========
  // const dispatch = useRootDispatch()
  // const [setCurrent,] = [
  //   SearchActions.setCurrent,
  //   SearchActions.addCategoryList,
  //   SearchActions.addCategoryLists,
  // ]
  // //#endregion  //*======== STORE ===========

  //#endregion  //*======== STATES ===========
  const [pageIdx, setPageIdx] = useState<number>(0)

  const reset = () => {
    setPageIdx(0)
  }
  useEffect(() => {
    reset()
  }, [])
  //#endregion  //*======== STATES ===========

  //#endregion  //*======== QUERIES ===========
  const { lists } = HardcoverEndpoints
  const { data } = lists.useQuery(
    {
      category: category as Hardcover.ListCategory,
    },
    {
      skip: !isValidCategory,
    },
  )

  const categoryLists: Hardcover.List[] = (data?.results ??
    []) as Hardcover.List[]
  const pageLimit = 10
  const paginatedCategoryLists: Hardcover.List[][] = getSegmentedArray(
    categoryLists,
    pageLimit,
  )
  const displayCategoryLists: Hardcover.List[] =
    paginatedCategoryLists?.[pageIdx] ?? []
  //#endregion  //*======== QUERIES ===========

  const maxPageIdx = paginatedCategoryLists.length - 1
  const isPaginationDisabled = maxPageIdx < 1 || !displayCategoryLists.length
  const isFirstPage = pageIdx === 0
  const isNextDisabled = pageIdx + 1 > maxPageIdx
  const isPrevDisabled = isFirstPage

  const pages = {
    prev: isPrevDisabled ? pageIdx : pageIdx - 1,
    next: isNextDisabled ? maxPageIdx : pageIdx + 1,
    max: paginatedCategoryLists.length - 1,
  }
  const pageRanges = getRangedArray({
    min: pages.prev,
    max: pages.next,
  })
  const isEllipsisDisabled = !(
    !isNextDisabled &&
    pageRanges.length < 3 &&
    pages.next !== pages.max
  )

  const onPageChange = (page: number) => {
    const isCurrentPage: boolean = page === pageIdx
    if (isCurrentPage) return

    const isValidPage: boolean = page >= 0 && page <= maxPageIdx
    if (!isValidPage) page = 0

    setPageIdx(page)
  }

  const onPagePrevious = () => onPageChange(pages.prev)
  const onPageNext = () => onPageChange(pages.next)

  return (
    <main className="page-container flex flex-col place-items-center gap-8 *:w-full">
      <section
        style={{
          backgroundImage: `linear-gradient(to bottom, hsl(var(--muted)) 0%, transparent 70%)`,
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
        }}
        className={cn(
          'relative w-full',
          'rounded-lg',

          'pt-8',
        )}
      >
        <div
          className={cn(
            'mx-auto w-11/12',
            'flex flex-col flex-wrap place-content-center place-items-center gap-8 sm:flex-row sm:place-content-start sm:place-items-start',
          )}
        >
          <aside className="flex flex-col gap-1 *:!mt-0">
            <h1>Discover Lists ✨</h1>

            <p className="leading-tight text-muted-foreground">
              Browse our catalogue of user curated lists to find your next read.
            </p>
          </aside>
        </div>
      </section>

      <Tabs
        defaultValue={Hardcover.DefaultListCategory}
        value={category}
        onValueChange={(c) => {
          const isValidPeriod = Hardcover.ListCategory.safeParse(c).success
          if (!isValidPeriod) return

          navigate(
            {
              pathname: '/lists/:category',
            },
            {
              params: {
                category: c,
              },
              unstable_viewTransition: true,
            },
          )
        }}
        className={cn('w-full py-4')}
      >
        <TabsList
          className={cn(
            '!h-auto !rounded-none border-b !bg-transparent pb-0',
            '*:rounded-b-none *:border-b *:!bg-transparent *:transition-all',
            'flex w-full flex-row !place-content-start place-items-center gap-x-8',

            'overflow-x-auto',
          )}
        >
          {Hardcover.ListCategory.options.map((category) => (
            <TabsTrigger
              key={`lists-tab-${category}`}
              value={category}
              className={cn(
                'capitalize',
                '!rounded-none data-[state=active]:border-primary',
              )}
            >
              <span className="h4 capitalize">{category}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        <main>
          <section
            className={cn(
              // 'max-h-[80dvh] w-full',
              'w-full',
              // 'flex flex-col gap-6',
              'flex flex-col gap-x-6 gap-y-8 lg:grid lg:grid-cols-2',
              'my-6',
              'snap-y snap-proximity overflow-y-auto',
            )}
          >
            {displayCategoryLists.map((hcList, idx) => {
              const list: List = HardcoverUtils.parseList(hcList)
              list.books = hcList.books.map((hcBook) =>
                HardcoverUtils.parseBook(hcBook),
              )

              // const slug = list?.slug ?? list?.key
              // let username = list?.creator?.key ?? BookSource.enum.shelvd
              // if (!username.startsWith('@')) username = `@${username}`

              // dispatch(
              //   addCategoryList({
              //     category: category as ListCategory,
              //     listKey: slug,
              //     listIdx: idx,
              //   }),
              // )

              // const onNavigate = () => {
              //   const params = {
              //     slug,
              //     source: list.source,
              //     category: searchCategory,
              //   }

              //   const ctx = {
              //     origin: hcList,
              //     common: list,

              //     isNotFound: false,
              //     isLoading: false,
              //   }

              //   dispatch(
              //     setCurrent({
              //       ...params,
              //       ...ctx,
              //     }),
              //   )

              //   navigate(
              //     {
              //       pathname: '/:username/list/:slug',
              //     },
              //     {
              //       params: {
              //         slug,
              //         username,
              //       },
              //       unstable_viewTransition: true,
              //     },
              //   )
              // }

              // logger({ breakpoint: '[[category].tsx:45]' }, { list, hcList })

              return (
                <List
                  list={list!}
                  key={`lists-${category}-${idx}-${list.key}`}
                >
                  <section
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
                    <div
                      className={cn(
                        'w-fit place-content-start place-items-start gap-2',
                        'flex flex-row flex-wrap',
                        'sm:max-w-xl',
                      )}
                    >
                      <List.Books displayLimit={12}>
                        <Book.Thumbnail className="w-fit !rounded-none" />
                      </List.Books>
                    </div>
                  </section>
                </List>
              )
            })}
          </section>

          <Pagination className={cn(isPaginationDisabled && 'hidden')}>
            <PaginationContent className="m-0">
              <PaginationItem
                className={cn(
                  isPrevDisabled && 'cursor-not-allowed opacity-50',
                )}
                onClick={() => {
                  if (isPrevDisabled) return
                  onPagePrevious()
                }}
              >
                <PaginationPrevious className="max-sm:!px-2 max-sm:[&>span]:hidden" />
              </PaginationItem>

              {pageRanges.map((pgIdx) => (
                <PaginationItem
                  key={`lists-${category}-page-${pgIdx}`}
                  onClick={() => {
                    onPageChange(pgIdx)
                  }}
                >
                  <PaginationLink isActive={pgIdx === pageIdx}>
                    {pgIdx + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem
                className={cn(isEllipsisDisabled && 'hidden')}
                onClick={() => {
                  if (isEllipsisDisabled) return
                  onPageNext()
                }}
              >
                <PaginationEllipsis />
              </PaginationItem>

              <PaginationItem
                className={cn(
                  isNextDisabled && 'cursor-not-allowed opacity-50',
                )}
                onClick={() => {
                  if (isNextDisabled) return
                  onPageNext()
                }}
              >
                <PaginationNext className="max-sm:!px-2 max-sm:[&>span]:hidden" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </main>
      </Tabs>
    </main>
  )
}

export default ListCategoryPage
