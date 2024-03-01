import { ShelvdEndpoints } from '@/data/clients/shelvd.api'
import { useRootDispatch } from '@/data/stores/root'
import { UserActions } from '@/data/stores/user.slice'
import { PropsWithChildren, createContext, useEffect } from 'react'

//#endregion  //*======== CONTEXT ===========
// eslint-disable-next-line @typescript-eslint/ban-types
export type UserContext = {}

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
  const dispatch = useRootDispatch()
  const { setLists } = UserActions

  const { getLists } = ShelvdEndpoints
  const { data: listData, isSuccess: isGetListSuccess } = getLists.useQuery()

  useEffect(() => {
    if (isGetListSuccess) {
      dispatch(setLists(listData))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGetListSuccess])

  return <UserContext.Provider value={{}}>{children}</UserContext.Provider>
}

export default User
