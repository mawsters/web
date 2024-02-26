import Book from '@/components/Book'

//#region  //*=========== QUERY PARAMETERS ===========
export type CollectionQueryResponse = {
  id: string
  title: string
  booklist: Book[]
}

export type CollectionQueryParams = {
  title: string
  booklist: Book[]
}
