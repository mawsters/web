import { ShelvdEndpoints } from '@/data/clients/shelvd.api'
import { useRootDispatch } from '@/data/stores/root'
import { UserActions } from '@/data/stores/user.slice'
import { ListTypeInfo } from '@/types/shelvd'
import { useUser } from '@clerk/clerk-react'
import { PropsWithChildren, createContext, useEffect } from 'react'

// eslint-disable-next-line @typescript-eslint/ban-types
type UserContext = {
  onRefetchListKeys: () => void
}

const UserContext = createContext<UserContext | undefined>(undefined)
// const useUserContext = () => {
//   const ctxValue = useContext(UserContext)
//   if (ctxValue === undefined) {
//     throw new Error(
//       'Expected an Context Provider somewhere in the react tree to set context value',
//     )
//   }
//   return ctxValue
// }
//#endregion  //*======== CONTEXT ===========

type UserProvider = PropsWithChildren
export const User = ({ children }: UserProvider) => {
  const { isSignedIn, user } = useUser()

  //#endregion  //*======== STORE ===========
  const dispatch = useRootDispatch()
  const [setLists, resetLists] = [UserActions.setLists, UserActions.resetLists]

  const username = user?.username ?? ''
  //#endregion  //*======== STORE ===========

  // const dispatch = useRootDispatch()
  // const { setLists } = UserActions

  const { getListKeys } = ShelvdEndpoints

  /** @external https://github.com/microsoft/TypeScript/issues/53514 */
  const {
    data: listKeys,
    isSuccess,
    refetch,
  } = getListKeys.useQuery(
    {
      username,
    },
    {
      skip: !isSignedIn || !username.length,
    },
  )

  useEffect(() => {
    if (!isSignedIn) {
      dispatch(resetLists())
      return
    }

    if (isSuccess) {
      dispatch(setLists(listKeys as ListTypeInfo))
    }
  }, [dispatch, isSignedIn, isSuccess, listKeys, resetLists, setLists])

  const onRefetchListKeys = () => {
    if (!isSignedIn) return

    refetch()
  }

  return (
    <UserContext.Provider
      value={{
        onRefetchListKeys,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export default User
