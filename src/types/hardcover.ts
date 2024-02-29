import { z } from 'zod'

export type BaseInfo = {
  id: string
  slug: string
}
export type Book = BaseInfo & {
  title: string
  author: string
  pubYear: number
  image: string
  isbns: string[]
}

export type Author = BaseInfo & {
  name: string
  image: string
  bookCount: number
}

export type Character = BaseInfo & {
  name: string
  bookCount: number
  author: string
}

export type List = BaseInfo & {
  name: string
  description: string
  bookCount: number
  books: Book[]
  titles?: string[]
}

export type SearchBook = Omit<Book, 'author' | 'pubYear' | 'image'> & {
  image: {
    url: string
  }
  release_year: number
  author_names: string[]
  description: string
}

export type SearchAuthor = Omit<Author, 'bookCount' | 'image'> & {
  image: {
    url: string
  }
  books_count: number
}

export type SearchCharacter = Omit<Character, 'bookCount' | 'author'> & {
  books_count: number
  author_names: string[]
}

export type SearchList = Omit<List, 'books' | 'bookCount'> & {
  books: string[]
  books_count: number
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

export const SearchCategories = [
  `books`,
  `authors`,
  'characters',
  'lists',
] as const
export type SearchCategories = (typeof SearchCategories)[number]
export const SearchCategory = z.enum(SearchCategories)
export const DefaultSearchCategory = SearchCategory.enum.books

export type SearchDocument<T extends SearchCategories> =
  T extends SearchCategories[0]
    ? SearchBook
    : T extends SearchCategories[1]
      ? SearchAuthor
      : unknown

export type SearchArtifact<T extends SearchCategories> =
  T extends SearchCategories[0]
    ? Book
    : T extends SearchCategories[1]
      ? Author
      : unknown

// type SearchQueryData<T extends SearchCategories> = SearchQueryResponse<SearchDocument<T>>;

export type SearchQueryResponse<T> = {
  results: {
    found: number
    page: number
    out_of: number
    hits: {
      document: T
    }[]
    request_params: {
      per_page: number
    }
  }[]
}
export type SearchCollectionParams = {
  query_by: string
  query_by_weights: string
  sort_by: string
  collection: string
}

export const BaseSearchParams = {
  per_page: 30,
  prioritize_exact_match: false,
  num_typos: 3,
}

export const QuerySearchParams = z.object({
  q: z
    .string({
      required_error: 'Query cannot be empty',
    })
    .default(''),
  page: z
    .number()
    .min(1, {
      message: 'Query page must be least 1',
    })
    .default(1)
    .optional(),
})
export type QuerySearchParams = z.infer<typeof QuerySearchParams>

export type SearchParams = typeof BaseSearchParams &
  QuerySearchParams &
  SearchCollectionParams

export const SearchCategoryCollectionParams: Record<
  SearchCategories,
  SearchCollectionParams
> = {
  [SearchCategory.enum.books]: {
    query_by: 'slug,title,isbns,series_names,author_names,alternative_titles',
    query_by_weights: '5,5,5,3,1,1',
    sort_by: 'users_count:desc,_text_match:desc',
    collection: 'Book_production',
  },
  [SearchCategory.enum.authors]: {
    query_by: 'slug,name,name_personal,alternate_names,series_names,books',
    query_by_weights: '5,3,3,3,2,1',
    sort_by: '_text_match:desc,books_count:desc',
    collection: 'Author_production',
  },
  [SearchCategory.enum.characters]: {
    query_by: 'name,books,author_names',
    query_by_weights: '4,2,2',
    sort_by: '_text_match:desc,books_count:desc',
    collection: 'Character_production',
  },
  [SearchCategory.enum.lists]: {
    query_by: 'name,description,books',
    query_by_weights: '3,2,1',
    sort_by: '_text_match:desc,followers_count:desc',
    collection: 'List_production',
  },
}
