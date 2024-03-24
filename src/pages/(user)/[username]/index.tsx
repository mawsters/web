import Book from '@/components/Book'
import List from '@/components/List'
import { RenderGuard } from '@/components/providers/render.provider'
import { ShelvdEndpoints } from '@/data/clients/shelvd.api'
import { useRootSelector } from '@/data/stores/root'
import { SearchSelectors } from '@/data/stores/search.slice'
import { ListData, User } from '@/types/shelvd'
import { cn } from '@/utils/dom'

const UserDetailPage = () => {
  //#endregion  //*======== STORE ===========
  const current = useRootSelector(SearchSelectors.state).current
  const user = current.origin as User
  //#endregion  //*======== STORE ===========

  //#endregion  //*======== PARAMS ===========
  const isValidUser = !!user
  //#endregion  //*======== PARAMS ===========

  //#endregion  //*======== QUERIES ===========
  const { getListsByType } = ShelvdEndpoints

  //#endregion  //*======== USER/CORELISTS ===========
  const queryCorelists = getListsByType.useQuery(
    {
      type: 'core',
      username: user?.username ?? '',
    },
    {
      skip: !isValidUser,
    },
  )
  const corelistsResults = (queryCorelists.data ?? []) as ListData[]
  const corelistsIsLoading =
    queryCorelists.isLoading || queryCorelists.isFetching
  const corelistsIsNotFound =
    !corelistsIsLoading && !queryCorelists.isSuccess && !corelistsResults.length
  //#endregion  //*======== USER/CORELISTS ===========

  //#endregion  //*======== QUERIES ===========

  if (!isValidUser || corelistsIsNotFound) return null
  return (
    <section>
      {corelistsResults.map((list) => {
        if (!list.booksCount) return null
        return (
          <RenderGuard
            key={`${user.id}-list-${list.key}`}
            renderIf={ListData.safeParse(list).success}
          >
            <List data={ListData.parse(list)}>
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
                    <Book.Thumbnail className="w-fit !rounded-none" />
                  </List.Books>
                </div>
              </div>
            </List>
          </RenderGuard>
        )
      })}
    </section>
  )
}

export default UserDetailPage
