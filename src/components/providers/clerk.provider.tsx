import { ButtonVariants } from '@/components/ui/Button'
import { env } from '@/env'
import { ClerkProvider as Clerk } from '@clerk/clerk-react'
import { PropsWithChildren } from 'react'

export const ClerkProvider = ({ children }: PropsWithChildren) => {
  return (
    <Clerk
      publishableKey={env.VITE_CLERK_PUBLISHABLE_KEY}
      appearance={{
        elements: {
          card: 'body [&>*:last-child]:hidden',
          formButtonPrimary: ButtonVariants({
            variant: 'secondary',
            size: 'sm',
          }),
          footerActionLink: 'text-secondary underline-offset-4 hover:underline',
        },
      }}
    >
      {children}
    </Clerk>
  )
}
