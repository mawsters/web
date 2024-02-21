import { OL } from '@/types'

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
