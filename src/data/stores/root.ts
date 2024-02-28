import { GoogleClient } from '@/data/clients/google.api'
import { HardcoverClient } from '@/data/clients/hardcover'
import { NYTClient } from '@/data/clients/nyt.api'
import { OLClient } from '@/data/clients/ol.api'
import { AppSlice } from '@/data/stores/app.slice'
import { env } from '@/env'
import {
  Action,
  ThunkAction,
  combineSlices,
  configureStore,
} from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { useDispatch, useSelector } from 'react-redux'
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist'
import { CollectionClient } from '../clients/collections.api'

const AppState = combineSlices(
  AppSlice,

  GoogleClient,

  NYTClient,

  OLClient,
  CollectionClient,
  HardcoverClient,
)
type AppState = ReturnType<typeof AppState>

// /** @external https://redux-toolkit.js.org/usage/usage-guide#use-with-redux-persist */
// const PersistConfig = {
//   key: AppName,
//   version: Number(AppVersion) ?? 0,
//   storage,
//   serialize: env.VITE_BETA_FLAG, // Data serialization is not required and disabling it allows you to inspect storage value in DevTools; Available since redux-persist@5.4.0
//   deserialize: env.VITE_BETA_FLAG, // Required to bear same value as `serialize` since redux-persist@6.0
// }

// const PersistState = persistReducer(PersistConfig, AppState)

export const AppStore = (() => {
  const store = configureStore({
    // reducer: PersistState,
    reducer: AppState,
    // preloadedState: state,
    devTools: env.VITE_BETA_FLAG,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          ignoredPaths: [
            'GoogleClient',
            'NYTClient',
            'OLClient',
            'CollectionClient',
            'HardcoverClient',
          ], // Paths to be excluded from serialization checks
        },
      }).concat([
        GoogleClient.middleware,
        NYTClient.middleware,
        OLClient.middleware,
        HardcoverClient.middleware,
        CollectionClient.middleware,
      ])
    },
  })
  setupListeners(store.dispatch)
  return store
})()
// export const AppStorePersistor = persistStore(AppStore)

export type AppStore = typeof AppStore
export type AppDispatch = AppStore['dispatch']
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  AppState,
  unknown,
  Action
>

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<AppState>()
