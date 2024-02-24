import { OL } from '@/types'
import { SearchCategory, SearchCategoryPrefix } from '@/types/ol'

export const getBookAuthorsAbbreviation = (olBook: OL.Book): string => {
  let authorAbbr = 'Unknown'
  const authors = olBook?.author_name ?? []
  if (authors.length < 1) return authorAbbr

  // default to top billing author
  authorAbbr = authors[0]

  // append others count
  const otherAuthorCount = authors.length - 1
  if (otherAuthorCount > 0) {
    authorAbbr += `{& otherAuthorCount others}`
  }

  return authorAbbr
}

export const getSearchQuery = ({
  query,
  category,
}: {
  query: string
  category?: SearchCategory
}): string => {
  // default category if none provided
  if (!category) category = SearchCategory[0]

  if (!query) return ''

  const prefix = SearchCategoryPrefix.get(category)
  return prefix + query
}
