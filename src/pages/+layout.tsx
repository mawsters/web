import { AppRoutes } from '@/app'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { AppCommandKey, AppThemeMode } from '@/data/static/app'
import { AppActions, AppSelectors } from '@/data/stores/app.slice'
import { useAppDispatch, useAppSelector } from '@/data/stores/root'
import { env } from '@/env'
import { cn } from '@/utils/dom'
import {
  ChevronRightIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  SunIcon,
} from '@radix-ui/react-icons'
import { Fragment, HTMLAttributes, useCallback, useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

type NavPaths = HTMLAttributes<HTMLDivElement>
export const NavPaths = ({ className, ...rest }: NavPaths) => {
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
            <Link
              to={`${pathHref}`}
              className={cn(
                'small flex-1 cursor-pointer truncate border-b border-primary/40 pb-0.5 text-center font-bold uppercase tracking-tight',
                pathname === pathHref
                  ? 'border-primary text-primary'
                  : 'hover:mb-0.5 hover:bg-primary hover:pb-0 hover:text-background',
              )}
            >
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

const Logo = () => {
  return (
    <div className={cn('flex flex-row place-items-center gap-1')}>
      <b
        className={cn(
          'max-w-prose text-center tracking-tight',
          'h3 sm:h2 whitespace-nowrap',
        )}
      >
        📚 shelvd
      </b>

      {env.VITE_BETA_FLAG && (
        <Badge className="hidden -translate-y-2/4 text-[0.5rem] uppercase sm:block">
          beta
        </Badge>
      )}
    </div>
  )
}

export default Logo
export const Nav = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    console.groupEnd()
    console.groupCollapsed(pathname)
    window.scrollTo(0, 0)
  }, [pathname])

  return (
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

        <NavRoutes />

        <QuickSearchCommandMenu />
        <ThemeButton />
      </main>
    </nav>
  )
}

export const IndexLayout = () => {
  return (
    <>
      <Nav />

      <Outlet />
    </>
  )
}

export const NavRoutes = () => {
  return (
    <div className="flex flex-col gap-1">
      {Object.entries(AppRoutes)
        .filter(([parent]) => parent.length > 2)
        .map(([parent, children]) => (
          <Fragment key={`path-${parent}`}>
            <Link
              to={parent}
              unstable_viewTransition
            >
              <Button>{parent}</Button>
            </Link>

            {children.map((child) => (
              <Link
                key={`path-${parent}-${child}`}
                to={child}
                unstable_viewTransition
              >
                <Button variant={'secondary'}>{child}</Button>
              </Link>
            ))}
          </Fragment>
        ))}
    </div>
  )
}

export function QuickSearchCommandMenu() {
  const dispatch = useAppDispatch()
  const [isVisible, setIsVisible] = [
    useAppSelector(AppSelectors.state).menuVisibility,
    AppActions.setMenuVisibility,
  ]

  const toggleVisibility = useCallback(() => {
    const visibility = !isVisible
    dispatch(setIsVisible(visibility))
  }, [dispatch, isVisible, setIsVisible])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === AppCommandKey && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        toggleVisibility()
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [dispatch, isVisible, setIsVisible, toggleVisibility])

  return (
    <>
      <div
        onClick={toggleVisibility}
        className={cn(
          'hidden flex-row place-content-between place-items-center gap-4 sm:flex',
          'h-9 w-full md:max-w-64',
          'rounded-md border border-input bg-transparent px-3 py-1 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',

          'text-sm text-muted-foreground',
        )}
      >
        <aside className="inline-flex flex-row place-items-center gap-1">
          <MagnifyingGlassIcon className="h-4 w-4" />
          <span>Quick Search</span>
        </aside>

        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>
          {AppCommandKey.toUpperCase()}
        </kbd>
      </div>

      <CommandDialog
        open={isVisible}
        onOpenChange={(visibility) => {
          dispatch(setIsVisible(visibility))
        }}
      >
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>Calendar</CommandItem>
            <CommandItem>Search Emoji</CommandItem>
            <CommandItem>Calculator</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}

export const ThemeButton = () => {
  const dispatch = useAppDispatch()
  const [themeMode, setThemeMode] = [
    useAppSelector(AppSelectors.state).themeMode,
    AppActions.setThemeMode,
  ]

  const isDarkMode = themeMode === AppThemeMode.enum.dark
  const ThemeModeIcon = isDarkMode ? MoonIcon : SunIcon
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => {
        const inverseThemeMode = isDarkMode
          ? AppThemeMode.enum.light
          : AppThemeMode.enum.dark
        dispatch(setThemeMode(inverseThemeMode))
      }}
    >
      <ThemeModeIcon className="h-4 w-4" />
    </Button>
  )
}
