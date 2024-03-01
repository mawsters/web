import { AppThemeMode } from '@/data/static/app'
import { StoreSlicePrefix } from '@/data/static/store'
import { createAsyncSlice } from '@/utils/store'
import { PayloadAction } from '@reduxjs/toolkit'
import { z } from 'zod'

const AppState = z.object({
  menuVisibility: z.boolean().default(false),
  themeMode: AppThemeMode,
})
type AppState = z.infer<typeof AppState>

const DefaultAppState: AppState = {
  menuVisibility: false,
  themeMode: AppThemeMode.enum.dark,
}

export const AppSlice = createAsyncSlice({
  name: `${StoreSlicePrefix}app`,
  initialState: DefaultAppState,
  reducers: (create) => ({
    setMenuVisibility: create.reducer(
      (state, action: PayloadAction<boolean>) => {
        state.menuVisibility = action.payload
      },
    ),
    setThemeMode: create.reducer(
      (state, action: PayloadAction<AppThemeMode>) => {
        state.themeMode = action.payload
      },
    ),
  }),
  selectors: {
    state: (state) => state,

    menuVisibility: (state) => state.menuVisibility,
    themeMode: (state) => state.themeMode,
  },
})

export const AppActions = AppSlice.actions
export const AppSelectors = AppSlice.selectors
