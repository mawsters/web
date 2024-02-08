import { z } from 'zod'

import AppPackage from '@/../package.json'

export const AppName = AppPackage.name
export const DebugPrefix = `@${AppName.toUpperCase()}`
export const AppVersion = AppPackage.version

export const AppBaseUrl = () => {
  if (typeof window !== 'undefined') return '' // browser should use relative url
  if (import.meta.env.VERCEL_URL) return `https://${import.meta.env.VERCEL_URL}` // SSR should use vercel url
  return `http://localhost:${import.meta.env.PORT ?? 3000}` // dev SSR should use localhost
}

export const AppThemeMode = z.enum(['dark', 'light', 'system'])
export type AppThemeMode = z.infer<typeof AppThemeMode>
export type ThemeMode = Exclude<z.infer<typeof AppThemeMode>, 'system'>
