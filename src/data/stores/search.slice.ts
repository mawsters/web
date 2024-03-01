import { StoreSlicePrefix } from '@/data/static/store'
import { Hardcover } from '@/types'
import { logger } from '@/utils/debug'
import { createAsyncSlice } from '@/utils/store'
import { PayloadAction } from '@reduxjs/toolkit'
import { z } from 'zod'

const SearchState = z.object({
  history: Hardcover.SearchCategoryHistory,
})
type SearchState = z.infer<typeof SearchState>

const DefaultSearchState: SearchState = {
  history: Hardcover.SearchCategoryHistory.parse({}),
}

export const SearchSlice = createAsyncSlice({
  name: `${StoreSlicePrefix}search`,
  initialState: DefaultSearchState,
  reducers: (create) => ({
    resetHistory: create.reducer(
      (
        state,
        action: PayloadAction<{
          category?: Hardcover.SearchCategories
        }>,
      ) => {
        const { category } = action.payload
        if (!category) {
          state.history = DefaultSearchState.history
        } else {
          state.history[category] = []
        }
      },
    ),

    addHistory: create.reducer(
      (
        state,
        action: PayloadAction<{
          category: Hardcover.SearchCategories
          query: Hardcover.QuerySearchParams['q']
        }>,
      ) => {
        logger(
          { breakpoint: '[search.slice.ts:39]/addHistory' },
          { payload: action.payload },
        )
        const { category, query } = action.payload
        if (!query.trim().length) return

        const history: string[] = state.history[category] ?? []
        const isExistingQuery = history.includes(query)
        if (!isExistingQuery) history.push(query)

        state.history[category] = history
      },
    ),
  }),
  selectors: {
    state: (state) => state,
    history: (state) => state.history,
  },
})

export const SearchActions = SearchSlice.actions
export const SearchSelectors = SearchSlice.selectors
