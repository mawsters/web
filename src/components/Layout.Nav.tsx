import BookSearch from '@/components/Book.Search'
import { Logo } from '@/components/Layout.Logo'
import { ThemeButton } from '@/components/Theme.Button'
import { Button } from '@/components/ui/Button'
import { AppActions } from '@/data/stores/app.slice'
import { useAppDispatch } from '@/data/stores/root'

import { cn } from '@/utils/dom'
import { SignedOut, SignInButton } from '@clerk/clerk-react'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { useEffect } from 'react'
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
            <BookSearch>
              <BookSearch.Command />
            </BookSearch>
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
//               <ChevronRightIcon className="h-4 w-4 pb-0.5" />
//             )}
//           </small>
//         )
//       })}
//     </div>
//   )
// }

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
