import { Hardcover } from '@/types'
import {
  Author,
  Book,
  BookSource,
  Character,
  List,
  SearchCategories,
  Series,
} from '@/types/shelvd'

export class HardcoverUtils {
  static source: BookSource = 'hc'

  static parseBook = (hcBook: Hardcover.Book): Book => {
    const book: Book = {
      key: hcBook.id,
      slug: hcBook.slug,
      title: hcBook.title,
      author: hcBook.author,
      image: hcBook.image,
      description: hcBook.description,
      source: HardcoverUtils.source,
    }

    if (hcBook?.series) {
      const series: Book['series'] = {
        key: hcBook?.series?.slug,
        slug: hcBook?.series?.slug,
        name: hcBook?.series?.name,
      }
      book['series'] = series
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

  static parseSeries = (hcSeries: Hardcover.Series): Series => {
    const series: Series = {
      key: hcSeries.id,
      slug: hcSeries.slug,
      name: hcSeries.name,
      bookCount: hcSeries.bookCount,
      author: hcSeries.author,
      source: HardcoverUtils.source,
      titles: hcSeries.titles,
    }
    return series
  }

  static parseBookDocument = ({
    document,
  }: {
    document: Hardcover.SearchBook
  }): Hardcover.Book => {
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
    const series = {
      position: +(document?.featured_series?.position ?? 0),
      count: +(document?.featured_series?.series_books_count ?? 0),
      name: document?.featured_series?.series_name ?? '',
      slug: document?.featured_series?.series_slug ?? '',
    }

    const hcBook: Hardcover.Book = {
      ...document,
      author,
      pubYear,
      image,
      series,
    }
    return hcBook
  }

  static parseSeriesDocument = ({
    document,
  }: {
    document: Hardcover.SearchSeries
  }): Hardcover.Series => {
    const bookCount: number = +(document?.books_count ?? 0)
    const author = document?.author_name ?? '???'
    const titles = document?.books ?? []

    const hcSeries: Hardcover.Series = {
      ...document,
      author,
      bookCount,
      titles,
    }
    return hcSeries
  }

  static parseAuthorDocument = ({
    document,
  }: {
    document: Hardcover.SearchAuthor
  }): Hardcover.Author => {
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

  static parseCharacterDocument = ({
    document,
  }: {
    document: Hardcover.SearchCharacter
  }): Hardcover.Character => {
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

  static parseListDocument = ({
    document,
  }: {
    document: Hardcover.SearchList
  }): Hardcover.List => {
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
    category: SearchCategories
    hit: {
      document: T
    }
  }) => {
    const document = hit?.document
    if (!document) return

    switch (category) {
      case 'books': {
        const hcBook = HardcoverUtils.parseBookDocument({
          document: document as unknown as Hardcover.SearchBook,
        })
        const book: Book = HardcoverUtils.parseBook(hcBook)
        return book
      }
      case 'authors': {
        const hcAuthor = HardcoverUtils.parseAuthorDocument({
          document: document as unknown as Hardcover.SearchAuthor,
        })
        const author = HardcoverUtils.parseAuthor(hcAuthor)
        return author
      }
      case 'characters': {
        const hcCharacter = HardcoverUtils.parseCharacterDocument({
          document: document as unknown as Hardcover.SearchCharacter,
        })
        const character = HardcoverUtils.parseCharacter(hcCharacter)
        return character
      }
      case 'lists': {
        const hcList = HardcoverUtils.parseListDocument({
          document: document as unknown as Hardcover.SearchList,
        })
        const list = HardcoverUtils.parseList(hcList)
        return list
      }
      case 'series': {
        const hcSeries = HardcoverUtils.parseSeriesDocument({
          document: document as unknown as Hardcover.SearchSeries,
        })
        const series = HardcoverUtils.parseSeries(hcSeries)
        return series
      }
    }
  }
}
