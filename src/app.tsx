// Import global styles to ensure consistent look across the entire application.
import '@/styles/globals.css'

// Import the main page component.
import IndexPage from '@/pages'

// Import context providers for managing global state, authentication, and theming.
import { ClerkProvider } from '@/components/providers/clerk.provider'
import ReduxProvider from '@/components/providers/redux.provider'
import { ThemeProvider } from '@/components/providers/theme.provider'

// Import layout and React essentials.
import { IndexLayout } from '@/pages/+layout'
import React from 'react'
import ReactDOM from 'react-dom/client'

// Import routing components from react-router-dom to manage page routing.
import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
} from 'react-router-dom'
import CollectionsPage from './pages/collections-page'
import CollectionPage from './pages/collection-page'
import CreateCollectionPopup from './components/CreateCollectionPopup'
import CollectionLayout from './pages/collections.layout'
import UpdateCollectionPopup from './components/UpdateCollectionPopup'

// Define the application's routes using react-router-dom's createBrowserRouter.
// This includes a base route and its children, facilitating nested routing.
export const AppRouter = createBrowserRouter([
  {
    path: '/',
    element: <IndexLayout />, // The layout component wraps around nested routes.
    children: [
      {
        path: '/',
        element: <IndexPage />, // The main page component to be rendered at the root path.
      },
    ],
  },
  {
    path: '/collections',
    element: <CollectionLayout />, // The layout component wraps around nested routes.
    children: [
      {
        path: '/collections',
        element: <CollectionsPage />        
      },
      {
        path: '/collections/create',
        element: <CreateCollectionPopup />
      },
      {
        path: '/collections/edit/:slug',
        element: <UpdateCollectionPopup />
      },
      {
        path: "/collections/:slug",
        element: <CollectionPage />
      },
    ],
  },
])

// Transform the defined routes into a simpler structure for easy access and manipulation.
// This structure maps parent routes to their children, facilitating navigation logic.
export const AppRoutes = AppRouter.routes.reduce(
  (routes: Record<string, string[]> = {}, route: RouteObject) => {
    const parentPath = route.path
    if (!parentPath) return routes // Skip if the route does not have a path.

    const childrenPath: string[] = []
    if (route.children?.length) {
      for (const childRoute of route.children) {
        const childPath = childRoute.path
        if (!childPath?.length) continue // Only add child routes with defined paths.
        childrenPath.push(childPath)
      }
    }

    routes[parentPath] = childrenPath // Map parent path to its children paths.
    return routes
  },
  {},
)

// Handle hot module replacement (HMR) for development, ensuring routes are disposed properly.
if (import.meta.hot) import.meta.hot.dispose(() => AppRouter.dispose())

// Define the main App component, wrapping it with various context providers.
// This setup ensures global state, theming, and authentication are available throughout the application.
export const App = () => {
  return (
    <ReduxProvider>
      <ThemeProvider>
        <ClerkProvider>
          <RouterProvider // Provides routing functionality.
            router={AppRouter}
            fallbackElement={<div>Loading ...</div>} // Displays while routes are loading.
            future={{ v7_startTransition: true }} // Enables future react-router-dom features.
          />
        </ClerkProvider>
      </ThemeProvider>
    </ReduxProvider>
  )
}

// Render the App component to the DOM, wrapping it in React.StrictMode for highlighting potential problems.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
