import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { useNavigate } from '@/router'
import { Hardcover } from '@/types'
import { TrendPeriodTitle } from '@/types/hardcover'
import { cn } from '@/utils/dom'
import { useEffect } from 'react'
import { Outlet, useLocation, useParams } from 'react-router-dom'

const TrendingLayout = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const baseRoute = '/trending'
  const currentRoute = pathname.endsWith(baseRoute)
    ? ''
    : pathname.split('/').pop()
  const isBaseRoute = currentRoute === ''

  const { period = Hardcover.DefaultTrendPeriod } = useParams()

  useEffect(() => {
    if (!isBaseRoute) return

    navigate(
      {
        pathname: '/trending/:period',
      },
      {
        params: {
          period: Hardcover.DefaultTrendPeriod,
        },
        unstable_viewTransition: true,
      },
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBaseRoute])

  return (
    <main className="page-container overflow-hidden">
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
            '[&>*]:rounded-b-none [&>*]:border-b [&>*]:!bg-transparent [&>*]:transition-all',
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
                '!rounded-none data-[state=active]:border-white',
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
