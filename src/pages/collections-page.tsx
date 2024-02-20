import { Card } from "@/components/ui/Card"
import { Collection } from "@/types/collection";
import { cn } from "@/utils/dom"
import { useState } from "react";
import { Link } from "react-router-dom"


const CollectionsPage = () => {
    const [collections, setCollections] = useState<Collection[]>(JSON.parse(localStorage.getItem('collections') ?? '[]'));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCollectionTitle, setNewCollectionTitle] = useState('');
  
    const addNewCollection = () => {
      const newCollection: Collection = {
        collectionId: collections.length + 1, // Simple ID assignment
        collectionTitle: newCollectionTitle,
        booklist: [],
      };
      const updatedCollections = [...collections, newCollection];
      localStorage.setItem('collections', JSON.stringify(updatedCollections));
      setCollections(updatedCollections);
      setIsModalOpen(false); // Close modal after adding
      setNewCollectionTitle(''); // Reset input field
    };
  
    return (
      <div>
        <button onClick={() => setIsModalOpen(true)}>Create Collection</button>
        {collections.map((collection: Collection, index: number) => (
          <Link to={`/collections/${collection.collectionId}`} key={index}>
            <CollectionCard title={collection.collectionTitle}></CollectionCard>
          </Link>
        ))}
        {isModalOpen && (
          <div className="modal">
            <input
              type="text"
              placeholder="Collection Title"
              value={newCollectionTitle}
              onChange={(e) => setNewCollectionTitle(e.target.value)}
            />
            <button onClick={addNewCollection}>Create</button>
            <button onClick={() => setIsModalOpen(false)}>Cancel</button>
          </div>
        )}
        
      </div>
    );
  };

export const CollectionCard = ({ title }: { title: string }) => {
    return (
        <Link to={""} className="no-underline">
            <Card
                className={cn(
                    'flex h-40 w-1/5 max-w-xs place-content-center place-items-center p-0.5',
                    'hover:bg-secondary',
                    'm-1', // Adjust margin as needed to fit 5 in a row considering the container width
                    'cursor-pointer' // Makes it clear the card is clickable
                )}
            >
                <h1>{title}</h1>
            </Card>
        </Link>
    );
}

export default CollectionsPage