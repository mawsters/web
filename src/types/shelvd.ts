import { z } from 'zod'

export const BookSources = [`ol`, `nyt`, `google`, `hc`, `shelvd`] as const
export const BookSource = z.enum(BookSources)
export type BookSource = z.infer<typeof BookSource>

export const BaseInfo = z.object({
  key: z.string().min(1),
  slug: z.string().default('').optional(),
  source: BookSource,
})
export type BaseInfo = z.infer<typeof BaseInfo>

export const Book = BaseInfo.extend({
  title: z.string().min(1),
  author: z.string().min(1),
  image: z.string().default('').optional(),
})
export type Book = z.infer<typeof Book>

export const Author = BaseInfo.extend({
  name: z.string().min(1),
  bookCount: z.number().default(0).optional(),
  image: z.string().default('').optional(),
})
export type Author = z.infer<typeof Author>

export const Character = BaseInfo.extend({
  name: z.string().min(1),
  author: z.string().min(1),
  bookCount: z.number().default(0).optional(),
})
export type Character = z.infer<typeof Character>

export const List = BaseInfo.extend({
  name: z.string().min(1),
  description: z.string().default('').optional(),
  bookCount: z.number().default(0).optional(),
  books: Book.array().default([]),
})
export type List = z.infer<typeof List>

export const ListTypes = [`core`, `created`, `following`] as const
export const ListType = z.enum(ListTypes)
export type ListType = z.infer<typeof ListType>
export const EditableListTypes: ListType[] = [
  ListType.enum.core,
  ListType.enum.created,
]
