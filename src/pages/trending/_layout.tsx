import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { AppName } from '@/data/static/app'
import { useNavigate, useParams } from '@/router'
import { Hardcover } from '@/types'
import { TrendPeriodTitle } from '@/types/hardcover'
import { cn } from '@/utils/dom'
import { Outlet } from 'react-router-dom'

const TrendingLayout = () => {
  const navigate = useNavigate()
  const { period = Hardcover.DefaultTrendPeriod } =
    useParams('/trending/:period')

  return (
    <main
      className={cn(
        'page-container',

        'flex flex-col gap-8',
        'place-items-center',
        '*:w-full',
      )}
    >
      <section
        style={{
          backgroundImage: `linear-gradient(to bottom, hsl(var(--muted)) 0%, transparent 70%)`,
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
        }}
        className={cn(
          'relative w-full',
          'rounded-lg',

          'pt-8',
        )}
      >
        <div
          className={cn(
            'mx-auto w-11/12',
            'flex flex-col flex-wrap place-content-center place-items-center gap-8 sm:flex-row sm:place-content-start sm:place-items-start',
          )}
        >
          <aside className="flex flex-col gap-1 *:!mt-0">
            <h1>What's Trending</h1>

            <p className="leading-tight text-muted-foreground">
              Discover popular titles currently captivating readers on {AppName}
              .
            </p>
          </aside>
        </div>
      </section>

      <Tabs
        defaultValue={Hardcover.DefaultTrendPeriod}
        value={period}
        onValueChange={(p) => {
          const isValidPeriod = Hardcover.TrendPeriod.safeParse(p).success
          if (!isValidPeriod) return

          navigate(
            {
              pathname: '/trending/:period',
            },
            {
              params: {
                period: p,
              },
              unstable_viewTransition: true,
            },
          )
        }}
        className={cn('w-full py-4')}
      >
        <TabsList
          className={cn(
            '!h-auto !rounded-none border-b !bg-transparent pb-0',
            '*:rounded-b-none *:border-b *:!bg-transparent *:transition-all',
            'flex w-full flex-row !place-content-start place-items-center gap-x-8',

            'overflow-x-auto',
          )}
        >
          {Object.entries(TrendPeriodTitle).map(([period, title]) => (
            <TabsTrigger
              key={`trending-tab-${period}`}
              value={period}
              className={cn(
                'capitalize',
                '!rounded-none data-[state=active]:border-primary',
              )}
            >
              <span className="h4">{title}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        <Outlet />
      </Tabs>
    </main>
  )
}

export default TrendingLayout
