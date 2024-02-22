import BookCard from '@/components/BookCard'
import { useAppSelector } from '@/data/stores/root'
import { Collection } from '@/types/collection'
import { useParams } from 'react-router-dom'
// import collectionService from "@/data/services/collections-service"
const CollectionPage = () => {
  // get collection id
  const { slug } = useParams()

  const collections = useAppSelector((state) => state.collections.data)
  // goes into collection array and return the collection json with the matching id
  const collection = collections.find(
    (collection: Collection) => collection.collectionId === Number(slug),
  )

  return (
    <div>
      {collection ? (
        <div>
          <h1>{collection.collectionTitle}</h1>
          <div>
            {collection.booklist.map((book) => (
              <BookCard
                key={book.bookId}
                bookId={book.bookId}
                bookTitle={book.bookTitle}
                bookAuthor={book.bookAuthor}
                bookUrl={book.bookUrl}
              />
            ))}
          </div>
        </div>
      ) : (
        <p>Collection not found</p>
      )}
    </div>
  )
}

export default CollectionPage
