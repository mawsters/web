import { BadgeVariants } from '@/components/ui/Badge'
import { ButtonVariants } from '@/components/ui/Button'
import { env } from '@/env'
import { cn } from '@/utils/dom'
import { ClerkProvider as Clerk } from '@clerk/clerk-react'
import { PropsWithChildren } from 'react'

export const ClerkProvider = ({ children }: PropsWithChildren) => {
  return (
    <Clerk
      publishableKey={env.VITE_CLERK_PUBLISHABLE_KEY}
      appearance={{
        layout: {
          logoPlacement: 'none',
        },
        elements: {
          card: '[&>*:last-child]:hidden',
          // card: '[&>*:last-child]:hidden dark:text-primary dark:bg-secondary',
          // userButtonPopoverActionButton: 'dark:*:text-primary',
          // userButtonPopoverActionButtonIcon: 'dark:*:text-primary',
          // profilePage: 'dark:*:text-primary',
          // header: 'dark:*:text-primary',
          // profileSection: 'dark:*:text-primary',
          // profileSectionTitle: 'dark:*:text-primary',
          // profileSectionContent: 'dark:*:text-primary dark:[&>*>*>*]:text-primary',
          // activeDevice: 'dark:*:text-primary dark:[&>*>*>*]:text-primary dark:[&>*>*]:text-primary dark:[&>*]:text-primary',
          // accordionContent: 'dark:*:text-primary dark:[&>*>*>*>*>*]:text-primary dark:[&>*>*>*>*]:text-primary dark:[&>*>*>*]:text-primary dark:[&>*>*]:text-primary dark:[&>*]:text-primary',
          // activeDeviceIcon: 'aspect-square rounded-lg bg-foreground',

          // accordionTriggerButton: 'dark:bg-foreground',
          // profileSection__activeDevices: 'dark:bg-foreground',
          // profileSectionTitle__activeDevices: 'dark:*:text-background',
          formButtonPrimary: cn(
            ButtonVariants({
              variant: 'secondary',
              size: 'sm',
            }),
            'invert dark:invert-0',
          ),
          footerActionLink: 'text-secondary underline-offset-4 hover:underline',
          profileSectionPrimaryButton: 'text-secondary',
          badge: BadgeVariants({
            variant: 'secondary',
          }),
          formButtonReset: 'text-secondary',
          formFieldInput: 'accent-background',
        },
      }}
    >
      {children}
    </Clerk>
  )
}
