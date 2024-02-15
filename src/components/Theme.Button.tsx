import { Button } from '@/components/ui/Button'
import { AppThemeMode } from '@/data/static/app'
import { AppActions, AppSelectors } from '@/data/stores/app.slice'
import { useAppDispatch, useAppSelector } from '@/data/stores/root'
import { MoonIcon, SunIcon } from '@radix-ui/react-icons'

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
