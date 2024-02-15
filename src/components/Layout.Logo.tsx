import { Badge } from '@/components/ui/Badge'
import { env } from '@/env'
import { cn } from '@/utils/dom'

export const Logo = () => {
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
        <Badge className="-translate-y-2/4 px-1 text-[0.5rem] uppercase">
          beta
        </Badge>
      )}
    </div>
  )
}
