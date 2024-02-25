import Book from '@/components/Book'
import { NYT } from '@/types'

export class NYTUtils {
  static parseBook = (nytBook: NYT.Book): Book => {
    const book: Book = {
      key: nytBook.primary_isbn10 ?? nytBook.primary_isbn13,
      title: nytBook.title,
      author: nytBook.author,
      image: nytBook.book_image,
      source: 'nyt',
    }
    return book
  }
}
