// Imports and setup for the navigation components, including utilities for styling, authentication, and routing.
import { AppRoutes } from '@/app'
import { BookSearchCommand } from '@/components/Book.Search'
import { Logo } from '@/components/Layout.Logo'
import { ThemeButton } from '@/components/Theme.Button'
import { Button } from '@/components/ui/Button'
import { AppActions } from '@/data/stores/app.slice'
import { useAppDispatch } from '@/data/stores/root'

import { cn } from '@/utils/dom'
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react'
import { ChevronRightIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { Fragment, HTMLAttributes, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

// Defines a button component that is only shown when the user is signed out, using Clerk for authentication.
export const AuthButton = () => {
  return (
    <SignedOut>
      <SignInButton mode={'modal'}>
        <Button>Login</Button>
      </SignInButton>
    </SignedOut>
  )
}

// Define the collection nav item after signing in 
export const CollectionsButton = () => {
  return (
    <SignedIn>
      <Link to={`/collections`}>
        Collections
      </Link>
    </SignedIn>
  )
}

// Main navigation component that displays the logo, routes, and other navigation-related components.
export const Nav = () => {
  const { pathname } = useLocation()

  // On route change, reset scroll to top and log the new path for debugging.
  useEffect(() => {
    console.groupEnd()
    console.group(pathname)
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <nav
        className={cn(
          'transition-all',
          'sticky inset-x-0 top-0 z-40',
          'h-16 py-3',
          'border-b bg-background/30 backdrop-blur',
        )}
      >
        <main className="container flex flex-row place-content-between place-items-center gap-2 py-2">
          <Logo />
          <CollectionsButton />
          {/* <NavRoutes /> */}
          <div className={cn('flex flex-row place-items-center gap-2')}>
            <BookSearchCommand />
            <ThemeButton />
            <AuthButton />
          </div>
        </main>
      </nav>
      <BottomNav />
    </>
  )
}

// Component to display navigation routes, filtering out routes with short paths and mapping each to a Button.
export const NavRoutes = () => {
  return (
    <div className="flex flex-col gap-1">
      {Object.entries(AppRoutes)
        .filter(([parent]) => parent.length > 2)
        .map(([parent, children]) => (
          <Fragment key={`path-${parent}`}>
            <Link to={parent} unstable_viewTransition>
              <Button>{parent}</Button>
            </Link>
            {children.map((child) => (
              <Link key={`path-${parent}-${child}`} to={child} unstable_viewTransition>
                <Button variant={'secondary'}>{child}</Button>
              </Link>
            ))}
          </Fragment>
        ))}
    </div>
  )
}

// Component to display the current navigation path as a breadcrumb-like list.
export const NavPaths = ({
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) => {
  const { pathname } = useLocation()
  const paths = pathname.split('/').slice(1)

  if (!paths.length) return null
  return (
    <div
      className={cn(
        'mb-6 flex flex-row flex-wrap place-items-center gap-0.5',
        className,
      )}
      {...rest}
    >
      {paths.map((path, idx) => {
        let pathHref = path
        if (idx > 0) pathHref = pathname.split(path)[0] + pathHref
        else pathHref = '/' + pathHref

        return (
          <small
            key={`path-${idx}`}
            className={cn(
              'inline-flex flex-row place-items-center gap-0.5',
              'w-fit max-w-prose truncate',
            )}
          >
            <Link to={`${pathHref}`} className={cn(
              'small flex-1 cursor-pointer truncate border-b border-primary/40 pb-0.5 text-center font-bold uppercase tracking-tight',
              pathname === pathHref
                ? 'border-primary text-primary'
                : 'hover:mb-0.5 hover:bg-primary hover:pb-0 hover:text-background',
            )}>
              {path.split('-').join(' ')}
            </Link>
            {idx < paths.length - 1 && (
              <ChevronRightIcon className="h-4 w-4 pb-0.5" />
            )}
          </small>
        )
      })}
    </div>
  )
}

// Bottom navigation component, primarily for mobile devices, to display a search icon that toggles the search menu.
export const BottomNav = () => {
  const dispatch = useAppDispatch()
  const { setMenuVisibility } = AppActions

  return (
    <nav
      className={cn(
        'transition-all sm:hidden',
        'fixed inset-x-0 bottom-4 z-40',
        'h-16 py-3',
        'border-b bg-background/30 backdrop-blur',
      )}
    >
      <main className="container flex flex-row place-content-between place-items-center gap-2 py-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            dispatch(setMenuVisibility(true))
          }}
        >
          <MagnifyingGlassIcon className="h-4 w-4" />
        </Button>
      </main>
    </nav>
  )
}
