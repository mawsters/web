import { useNavigate, useParams } from '@/router'
import { cn } from '@/utils/dom'
import { useEffect } from 'react'

const UserDetailPage = () => {
  const navigate = useNavigate()
  const { username = '' } = useParams('/:username')

  const isValidUsername = username.startsWith('@')

  useEffect(() => {
    if (!isValidUsername) {
      navigate(
        {
          pathname: '/',
        },
        {},
      )
    }
  }, [isValidUsername, navigate])

  //#endregion  //*======== QUERIES ===========

  //#endregion  //*======== QUERIES ===========

  return (
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
          <h1>{username}</h1>

          <p className="leading-tight text-muted-foreground">{username}</p>
        </aside>
      </div>
    </section>
  )
}

export default UserDetailPage
