import '@/styles/globals.css'

import ReduxProvider from '@/components/providers/redux.provider'
import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
} from 'react-router-dom'
// Import the layouts
import RootLayout from './layouts/root-layout'
import DashboardLayout from './layouts/dashboard-layout'
 
// Import the components
import IndexPage from '@/pages'
import SignInPage from './pages/sign-in'
import SignUpPage from './pages/sign-up'
import DashboardPage from './pages/dashboard'

export const AppRouter = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <IndexPage /> },
      { path: "/sign-in", element: <SignInPage /> },
      { path: "/sign-up", element: <SignUpPage /> },
      {
        element: <DashboardLayout />,
        path: "dashboard",
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
        ]
      }
    ]
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
      <RouterProvider
        router={AppRouter}
        fallbackElement={<div>Loading ...</div>}
        future={{ v7_startTransition: true }}
      />
    </ReduxProvider>
  )
}



ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,    
)