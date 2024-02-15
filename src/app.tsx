import '@/styles/globals.css'

import IndexPage from '@/pages'

import { ClerkProvider } from '@/components/providers/clerk.provider'
import ReduxProvider from '@/components/providers/redux.provider'
import { ThemeProvider } from '@/components/providers/theme.provider'
import { IndexLayout } from '@/pages/+layout'
import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
} from 'react-router-dom'

export const AppRouter = createBrowserRouter([
  {
    path: '/',
    element: <IndexLayout />,
    children: [
      {
        path: '/',
        element: <IndexPage />,
      },
    ],
  },
])

export const AppRoutes = AppRouter.routes.reduce(
  (routes: Record<string, string[]> = {}, route: RouteObject) => {
    const parentPath = route.path
    if (!parentPath) return routes

    const childrenPath: string[] = []
    if (route.children?.length) {
      for (const childRoute of route.children) {
        const childPath = childRoute.path
        if (!childPath?.length) continue
        childrenPath.push(childPath)
      }
    }

    routes[parentPath] = childrenPath
    return routes
  },
  {},
)

if (import.meta.hot) import.meta.hot.dispose(() => AppRouter.dispose())

export const App = () => {
  return (
    <ReduxProvider>
      <ThemeProvider>
        <ClerkProvider>
          <RouterProvider
            router={AppRouter}
            fallbackElement={<div>Loading ...</div>}
            future={{ v7_startTransition: true }}
          />
        </ClerkProvider>
      </ThemeProvider>
    </ReduxProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
