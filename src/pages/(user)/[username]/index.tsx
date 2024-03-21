import Book from '@/components/Book'
import { List } from '@/components/List'
import { Button } from '@/components/ui/Button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { ShelvdEndpoints } from '@/data/clients/shelvd.api'
import { useNavigate, useParams } from '@/router'
import { DefaultListType, ListData, ListType } from '@/types/shelvd'
import { cn } from '@/utils/dom'
import { QuestionMarkCircledIcon, UpdateIcon } from '@radix-ui/react-icons'
import { useEffect, useState } from 'react'

const UserDetailPage = () => {
  const navigate = useNavigate()
  const { username = '' } = useParams('/:username')

  const isValidUsername = username.startsWith('@')

  useEffect(() => {
    if (!isValidUsername) {
      navigate({
        pathname: '/',
      })
    }
  }, [isValidUsername, navigate])

  //#endregion  //*======== STATES ===========
  const [listType, setListType] = useState<ListType>(DefaultListType)
  //#endregion  //*======== STATES ===========

  //#endregion  //*======== QUERIES ===========
  const { getUserByUsername, getListByType } = ShelvdEndpoints
  const {
    data: user,
    isLoading: isLoadingUser,
    isFetching: isFetchingUser,
  } = getUserByUsername.useQuery(
    {
      username,
    },
    {
      skip: !isValidUsername,
    },
  )
  const { data: lists = [] } = getListByType.useQuery(
    {
      type: listType,
      username,
    },
    {
      skip: !isValidUsername,
    },
  )
  //#endregion  //*======== QUERIES ===========

  // //#endregion  //*======== MUTATIONS ===========
  // const [createList] = useCreateListMutation()

  // const

  // //#endregion  //*======== MUTATIONS ===========

  //#endregion  //*======== STATUS ===========
  const isLoading = isLoadingUser || isFetchingUser
  const isNotFound = !isLoading && !user

  const StatusIcon = isNotFound ? QuestionMarkCircledIcon : UpdateIcon
  const StatusText = isNotFound ? 'Not Found' : 'Hang on...'
  //#endregion  //*======== STATUS ===========

  return (
    <>
      <div
        className={cn(
          'flex w-full flex-row place-content-center place-items-center gap-2 text-muted-foreground',
          !(isLoading || isNotFound) && '!hidden',
        )}
      >
        <StatusIcon
          className={cn('size-4 animate-spin', isNotFound && 'animate-none')}
        />
        <span>{StatusText}</span>
      </div>

      {!!user && (
        //TODO: migrate to <User/>
        <>
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
                <h1>{`${user?.firstName ?? ''} ${user?.lastName ?? ''}`}</h1>

                <p className="leading-tight text-muted-foreground">{`@${user?.username}`}</p>
              </aside>
            </div>
          </section>

          <Button onClick={() => {}}>Create List</Button>

          <Tabs
            value={listType}
            onValueChange={(t) => {
              const isValidType = ListType.safeParse(t).success
              if (!isValidType) return

              setListType(ListType.parse(t))
            }}
            className={cn('w-full py-4')}
          >
            <TabsList
              className={cn(
                '!h-auto !rounded-none border-b !bg-transparent pb-0',
                '*:rounded-b-none *:border-b *:!bg-transparent *:transition-all',
                'flex w-full flex-row !place-content-start place-items-center gap-x-4',

                'overflow-x-auto',
              )}
            >
              {ListType.options.map((type) => (
                <TabsTrigger
                  key={`listType-tab-${type}`}
                  value={type}
                  className={cn(
                    'capitalize',
                    'data-[state=active]:border-primary',
                  )}
                >
                  <span>{type}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {(lists as ListData[]).map((list) => (
              <List
                data={ListData.parse(list)}
                key={`${listType}-list-${list.key}`}
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
                      <Book.Thumbnail className="w-fit !rounded-none" />
                    </List.Books>
                  </div>
                </div>
              </List>
            ))}
          </Tabs>
        </>
      )}
    </>
  )
}

export default UserDetailPage
