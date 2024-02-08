import { GoogleClient } from "@/data/clients/google.api"
import { NYTClient } from "@/data/clients/nyt.api"
import { CounterSlice } from "@/data/stores/counter.slice"
import { Action, ThunkAction, combineSlices, configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { useDispatch, useSelector } from "react-redux"

const AppState = combineSlices(
  CounterSlice,
  GoogleClient,
  NYTClient,
)
type AppState = ReturnType<typeof AppState>

export const AppStore = ((state?: Partial<AppState>) => {
  const store = configureStore({
    reducer: AppState,
    preloadedState: state,
    middleware: getDefaultMiddleware => {
      return getDefaultMiddleware().concat([
        GoogleClient.middleware,
        NYTClient.middleware,
      ])
    },
  })
  setupListeners(store.dispatch)
  return store
})()

export type AppStore = typeof AppStore
export type AppDispatch = AppStore["dispatch"]
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  AppState,
  unknown,
  Action
>

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<AppState>()