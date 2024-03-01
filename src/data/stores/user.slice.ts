import { StoreSlicePrefix } from '@/data/static/store'
import { List, ListType } from '@/types/shelvd'
import { ShelvdUtils } from '@/utils/clients/shelvd'
import { createAsyncSlice } from '@/utils/store'
import { PayloadAction } from '@reduxjs/toolkit'
import { z } from 'zod'

const UserState = z.object({
  lists: z.record(ListType, List.array()),
})
type UserState = z.infer<typeof UserState>

const DefaultUserState: UserState = {
  lists: {
    core: ShelvdUtils.createCoreLists(),
    created: [],
    following: [],
  },
}

export const UserSlice = createAsyncSlice({
  name: `${StoreSlicePrefix}user`,
  initialState: DefaultUserState,
  reducers: (create) => ({
    setLists: create.reducer(
      (state, action: PayloadAction<UserState['lists']>) => {
        state.lists = action.payload
      },
    ),
  }),
  selectors: {
    state: (state) => state,
  },
})

export const UserActions = UserSlice.actions
export const UserSelectors = UserSlice.selectors
