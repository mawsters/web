import { Collection } from "@/types/collection";
import { useParams } from "react-router-dom";
// import collectionService from "@/data/services/collections-service"
const CollectionPage = () => {
  // dynamically generate the booklist after retrieving the collection
  const { id } = useParams();

  // in like a useEffects or something
  // const collections = await collectionService.getAll();
  const collections = JSON.parse(localStorage.getItem('collections') ?? '[]');
  const collection = collections.find((collection: Collection) => collection.collectionId === Number(id));

  return (
    <div>
      {collection ? (
        <div>
          <h1>{collection.title}</h1>
          <p>Author: {collection.author}</p>
        </div>
      ) : (
        <p>Collection not found</p>
      )}
    </div>
  );
}

export default CollectionPage;

