import { StoreSlicePrefix } from '@/data/static/store'
import { Hardcover } from '@/types'
import {
  BookSource,
  DefaultBookSource,
  DefaultSearchCategory,
  SearchArtifact,
  SearchCategories,
  SearchCategoryHistory,
} from '@/types/shelvd'
import { logger } from '@/utils/debug'
import { createAsyncSlice } from '@/utils/store'
import { PayloadAction } from '@reduxjs/toolkit'

//#endregion  //*======== TYPES ===========
type SourceOriginMap<TT extends SearchCategories> = {
  ol: unknown
  nyt: unknown
  google: unknown
  hc: Hardcover.SearchDocument<TT>
  shelvd: unknown
}
export type SourceOrigin<
  T extends BookSource,
  TT extends SearchCategories,
> = SourceOriginMap<TT>[T]

export type CurrentSourceData = {
  /** @description raw response data from sources */
  origin?: SourceOrigin<BookSource, SearchCategories>
  /** @description parsed response data */
  common?: SearchArtifact<SearchCategories>

  isNotFound: boolean
  isLoading: boolean
}

export type CurrentSearchMap = CurrentSourceData & {
  slug: string
  source: BookSource
  category: SearchCategories
}
//#endregion  //*======== TYPES ===========

type SearchState = {
  history: SearchCategoryHistory
  current: CurrentSearchMap
}

const DefaultSearchState: SearchState = {
  history: SearchCategoryHistory.parse({}),

  current: {
    slug: '',
    source: DefaultBookSource,
    category: DefaultSearchCategory,

    origin: undefined,
    common: undefined,

    isNotFound: false,
    isLoading: true,
  },
}

export const SearchSlice = createAsyncSlice({
  name: `${StoreSlicePrefix}search`,
  initialState: DefaultSearchState,
  reducers: (create) => ({
    //#endregion  //*======== HISTORY ===========
    resetHistory: create.reducer(
      (
        state,
        action: PayloadAction<{
          category?: SearchCategories
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
          category: SearchCategories
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
    //#endregion  //*======== HISTORY ===========

    //#endregion  //*======== CURRENT ===========
    resetCurrent: create.reducer((state) => {
      state.current = DefaultSearchState.current
    }),

    setCurrentSlugSource: create.reducer(
      (
        state,
        action: PayloadAction<{
          slug: string
          source: BookSource
          category: SearchCategories
        }>,
      ) => {
        logger(
          { breakpoint: '[search.slice.ts:115]/setCurrentSlug' },
          { payload: action.payload },
        )
        const { slug, source, category } = action.payload

        state.current.slug = slug
        state.current.source = source
        state.current.category = category
      },
    ),

    setCurrent: create.reducer(
      (state, action: PayloadAction<SearchState['current']>) => {
        const isCurrentLoading = action.payload.isLoading
        if (isCurrentLoading) return

        logger(
          { breakpoint: '[search.slice.ts:160]/setCurrent' },
          {
            prev: state.current,
            current: action.payload,
          },
        )

        state.current = action.payload
      },
    ),
    //#endregion  //*======== CURRENT ===========
  }),
  selectors: {
    state: (state) => state,
    history: (state) => state.history,
  },
})

export const SearchActions = SearchSlice.actions
export const SearchSelectors = SearchSlice.selectors
