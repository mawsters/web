import { z } from 'zod'

export type Book = {
  slug: string
  title: string
  author: string
  pubYear: number
  image: string
  id: string
  isbns: string[]
}

export const TrendPeriods = [`recent`, `year`, `all`] as const
export const TrendPeriod = z.enum(TrendPeriods)
export type TrendPeriod = z.infer<typeof TrendPeriod>
export const DefaultTrendPeriod: TrendPeriod = TrendPeriod.enum.recent
export const TrendPeriodTitle: Record<TrendPeriod, string> = {
  [TrendPeriod.enum.recent]: 'Last 3 Months',
  [TrendPeriod.enum.year]: 'Last 12 Months',
  [TrendPeriod.enum.all]: 'All Time',
}

export type TrendPeriodBooks = Record<TrendPeriod, Book[]>
export type TrendPeriodBooksMap = Map<TrendPeriod, Book[]>

export type QueryResponse<T> = {
  total: number
  results: T
}

export type BookList = {
  id: string
  name: string
  slug: string
  description: string
  booksCount: number
  books: Book[]
}
