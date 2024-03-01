import { Hardcover } from '@/types'
import { Author, Book, BookSource, Character, List } from '@/types/shelvd'

export class HardcoverUtils {
  static source: BookSource = 'hc'

  static parseBook = (hcBook: Hardcover.Book): Book => {
    const book: Book = {
      key: hcBook.id,
      slug: hcBook.slug,
      title: hcBook.title,
      author: hcBook.author,
      image: hcBook.image,
      source: HardcoverUtils.source,
    }
    return book
  }
  static parseAuthor = (hcAuthor: Hardcover.Author): Author => {
    const author: Author = {
      key: hcAuthor.id,
      slug: hcAuthor.slug,
      name: hcAuthor.name,
      image: hcAuthor.image,
      bookCount: hcAuthor.bookCount,
      source: HardcoverUtils.source,
    }
    return author
  }
  static parseCharacter = (hcCharacter: Hardcover.Character): Character => {
    const character: Character = {
      key: hcCharacter.id,
      slug: hcCharacter.slug,
      name: hcCharacter.name,
      bookCount: hcCharacter.bookCount,
      author: hcCharacter.author,
      source: HardcoverUtils.source,
    }
    return character
  }
  static parseList = (hcList: Hardcover.List): List => {
    const list: List = {
      key: hcList.id,
      slug: hcList.slug,
      name: hcList.name,
      bookCount: hcList.bookCount,
      description: hcList.description,
      books: [],
      source: HardcoverUtils.source,
    }
    return list
  }

  static parseBookDocument = <T = Hardcover.SearchBook>({
    hit,
  }: {
    hit: {
      document: T
    }
  }): Hardcover.Book => {
    const document = hit.document as Hardcover.SearchBook

    const image = (document?.image?.url ?? '')
      .replace(
        'https://hardcover-staging.imgix.net',
        'https://storage.googleapis.com/hardcover-staging',
      )
      .replace(
        'https://hardcover.imgix.net',
        'https://storage.googleapis.com/hardcover',
      )
    const pubYear = +document?.release_year
    const author = document?.author_names?.[0] ?? '???'

    const hcBook: Hardcover.Book = {
      ...document,
      author,
      pubYear,
      image,
    }
    return hcBook
  }
  static parseAuthorDocument = <T = Hardcover.SearchAuthor>({
    hit,
  }: {
    hit: {
      document: T
    }
  }): Hardcover.Author => {
    const document = hit.document as Hardcover.SearchAuthor

    const name: string = document?.name ?? '???'
    const image: string = document?.image?.url ?? ''
    const bookCount: number = +(document?.books_count ?? 0)

    const hcAuthor: Hardcover.Author = {
      ...document,
      name,
      image,
      bookCount,
    }
    return hcAuthor
  }

  static parseCharacterDocument = <T = Hardcover.SearchCharacter>({
    hit,
  }: {
    hit: {
      document: T
    }
  }): Hardcover.Character => {
    const document = hit.document as Hardcover.SearchCharacter

    const name: string = document?.name ?? '???'
    const author = document?.author_names?.[0] ?? '???'
    const bookCount: number = +(document?.books_count ?? 0)

    const hcCharacter: Hardcover.Character = {
      ...document,
      name,
      author,
      bookCount,
    }
    return hcCharacter
  }

  static parseListDocument = <T = Hardcover.SearchList>({
    hit,
  }: {
    hit: {
      document: T
    }
  }): Hardcover.List => {
    const document = hit.document as Hardcover.SearchList

    const titles: string[] = document?.books ?? []
    const bookCount: number = +(document?.books_count ?? 0)

    const hcList: Hardcover.List = {
      ...document,
      titles,
      bookCount,
      books: [],
    }
    return hcList
  }

  static parseDocument = <T>({
    category,
    hit,
  }: {
    category: Hardcover.SearchCategories
    hit: {
      document: T
    }
  }) => {
    switch (category) {
      case 'books': {
        const hcBook = HardcoverUtils.parseBookDocument({ hit })
        const book: Book = HardcoverUtils.parseBook(hcBook)
        return book
      }
      case 'authors': {
        const hcAuthor = HardcoverUtils.parseAuthorDocument({ hit })
        const author = HardcoverUtils.parseAuthor(hcAuthor)
        return author
      }
      case 'characters': {
        const hcCharacter = HardcoverUtils.parseCharacterDocument({ hit })
        const character = HardcoverUtils.parseCharacter(hcCharacter)
        return character
      }
      case 'lists': {
        const hcList = HardcoverUtils.parseListDocument({ hit })
        const list = HardcoverUtils.parseList(hcList)
        return list
      }
    }
  }
}
