export interface Collection {
  collectionId: number
  collectionTitle: string
  booklist: {
    bookId: number
    bookTitle: string
    bookAuthor: string
    bookUrl: string
  }[]
}
