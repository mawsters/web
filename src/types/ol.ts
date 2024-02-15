export type Book = {
  key: string /* "/works/OL82563W" */
  cover_edition_key: string /* "OL46071324M" */
  title: string

  author_key: string
  author_name: string[]
  cover_i: number /* 14419192 */
}

export type SearchQueryResponse<T = Book> = {
  numFound: number
  start: number
  numFoundExact: boolean
  docs: T[]
}
