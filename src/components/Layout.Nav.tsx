import { Logo } from '@/components/Layout.Logo'
import Search from '@/components/Layout.Search'
import { ThemeButton } from '@/components/Theme.Button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert'
import { Button, ButtonProps } from '@/components/ui/Button'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/Drawer'
import { AppActions } from '@/data/stores/app.slice'
import { useRootDispatch } from '@/data/stores/root'
import { Link, useNavigate } from '@/router'
import { Hardcover } from '@/types'

import { cn } from '@/utils/dom'
import { SignedOut, SignInButton } from '@clerk/clerk-react'
import {
  ArrowTopRightIcon,
  ExclamationTriangleIcon,
  HamburgerMenuIcon,
  MagnifyingGlassIcon,
} from '@radix-ui/react-icons'
import { ComponentProps, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export const AuthButton = () => {
  return (
    <SignedOut>
      <SignInButton mode={'modal'}>
        <Button>Login</Button>
      </SignInButton>
    </SignedOut>
  )
}

export const Nav = () => {
  const { pathname } = useLocation()

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
          'py-3',
          'border-b bg-background/30 backdrop-blur',
        )}
      >
        <main className="container flex flex-row place-content-between place-items-center gap-2 py-2">
          <Logo />

          <div className={cn('flex flex-row place-items-center gap-2')}>
            <Search.Command />
            <DrawerMenu
              direction="right"
              trigger={{
                className: 'hidden sm:inline-flex',
              }}
            />

            <ThemeButton />

            <AuthButton />
          </div>
        </main>
      </nav>

      <BottomNav />
    </>
  )
}

// export const NavRoutes = () => {
//   return (
//     <div className="flex flex-col gap-1">
//       {Object.entries(AppRoutes)
//         .filter(([parent]) => parent.length > 2)
//         .map(([parent, children]) => (
//           <Fragment key={`path-${parent}`}>
//             <Link
//               to={parent}
//               unstable_viewTransition
//             >
//               <Button>{parent}</Button>
//             </Link>

//             {children.map((child) => (
//               <Link
//                 key={`path-${parent}-${child}`}
//                 to={child}
//                 unstable_viewTransition
//               >
//                 <Button variant={'secondary'}>{child}</Button>
//               </Link>
//             ))}
//           </Fragment>
//         ))}
//     </div>
//   )
// }

// export const NavPaths = ({
//   className,
//   ...rest
// }: HTMLAttributes<HTMLDivElement>) => {
//   const { pathname } = useLocation()
//   const paths = pathname.split('/').slice(1)

//   if (!paths.length) return null
//   return (
//     <div
//       className={cn(
//         'mb-6 flex flex-row flex-wrap place-items-center gap-0.5',
//         className,
//       )}
//       {...rest}
//     >
//       {paths.map((path, idx) => {
//         let pathHref = path
//         if (idx > 0) pathHref = pathname.split(path)[0] + pathHref
//         else pathHref = '/' + pathHref

//         return (
//           <small
//             key={`path-${idx}`}
//             className={cn(
//               'inline-flex flex-row place-items-center gap-0.5',
//               'w-fit max-w-prose truncate',
//             )}
//           >
//             <Link
//               to={`${pathHref}`}
//               className={cn(
//                 'small flex-1 cursor-pointer truncate border-b border-primary/40 pb-0.5 text-center font-bold uppercase tracking-tight',
//                 pathname === pathHref
//                   ? 'border-primary text-primary'
//                   : 'hover:mb-0.5 hover:bg-primary hover:pb-0 hover:text-background',
//               )}
//             >
//               {path.split('-').join(' ')}
//             </Link>

//             {idx < paths.length - 1 && (
//               <ChevronRightIcon className="size-4 pb-0.5" />
//             )}
//           </small>
//         )
//       })}
//     </div>
//   )
// }

export const BottomNav = () => {
  const dispatch = useRootDispatch()
  const { setSearchCommandVisibility } = AppActions

  return (
    <nav
      className={cn(
        'transition-all sm:hidden',
        'fixed inset-x-0 bottom-4 z-40',
        'h-16 py-2',
        'border-b bg-background/30 backdrop-blur',
      )}
    >
      <main className="container flex h-full flex-row place-content-between place-items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            dispatch(setSearchCommandVisibility(true))
          }}
        >
          <MagnifyingGlassIcon className="size-4" />
        </Button>

        <DrawerMenu />

        <Link
          to={{
            pathname: '/trending/:period',
          }}
          params={{
            period: Hardcover.DefaultTrendPeriod,
          }}
          unstable_viewTransition
        >
          <Button
            variant="outline"
            size="icon"
          >
            <ArrowTopRightIcon className="size-4" />
          </Button>
        </Link>
      </main>
    </nav>
  )
}

type DrawerMenu = ComponentProps<typeof Drawer> & {
  trigger?: ButtonProps
  content?: ComponentProps<typeof DrawerContent>
}
const DrawerMenu = ({ trigger, content, direction, ...props }: DrawerMenu) => {
  const navigate = useNavigate()
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)

  return (
    <Drawer
      open={isDrawerOpen}
      onOpenChange={setIsDrawerOpen}
      direction={direction}
      {...props}
    >
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          {...trigger}
        >
          <HamburgerMenuIcon className="size-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent
        {...content}
        className={cn(
          '!my-0 px-8 pb-8',
          direction === 'right' && 'inset-x-auto right-0 h-full',
          direction === 'top' && ' max-h-[50dvh]',
          content?.className,
        )}
      >
        <Alert
          variant="warning"
          className="my-4 mb-4"
        >
          <ExclamationTriangleIcon className="size-4" />
          <AlertTitle>WIP</AlertTitle>
          <AlertDescription>This feature is in development</AlertDescription>
        </Alert>

        <Button
          variant="outline"
          onClick={() => {
            setIsDrawerOpen(false)
            navigate({
              pathname: '/trending',
            })
          }}
        >
          Trending
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            setIsDrawerOpen(false)
            navigate({
              pathname: '/collections',
            })
          }}
        >
          Collections
        </Button>
      </DrawerContent>
    </Drawer>
  )
}
