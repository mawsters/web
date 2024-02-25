import Book from '@/components/Book'
import { Hardcover } from '@/types'

export class HardcoverUtils {
  static parseBook = (hcBook: Hardcover.Book): Book => {
    const book: Book = {
      key: hcBook.id,
      title: hcBook.title,
      author: hcBook.author,
      image: hcBook.image,
      source: 'hc',
    }
    return book
  }
}
