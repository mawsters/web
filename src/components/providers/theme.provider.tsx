'use client'

import { AppThemeMode } from '@/data/static/app'
import { AppSelectors } from '@/data/stores/app.slice'
import { useAppSelector } from '@/data/stores/root'
import { PropsWithChildren, useEffect } from 'react'

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const { themeMode } = useAppSelector(AppSelectors.state)

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove(...AppThemeMode.options)

    root.classList.add(themeMode)
  }, [themeMode])

  return children
}
