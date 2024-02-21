import { CollectionCard } from "@/components/CollectionCard";
import { Button } from "@/components/ui/Button";
import { initializeCollections } from "@/data/stores/collection.slice";
import { useAppDispatch, useAppSelector } from "@/data/stores/root";
import { Collection } from "@/types/collection";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CollectionsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // get the state from the reducer

  useEffect(() => {
    dispatch(initializeCollections());
  }, [dispatch])
  const collections = useAppSelector(state => state.collections.data);
  console.log("Collections", collections);

  return (
    <div>
      <Button onClick={() => navigate(`/collections/create`)}>Create Collection</Button>
      {collections.map((collection: Collection) => (
        // create CollectionCard
        <CollectionCard key={collection.collectionId} id={collection.collectionId} title={collection.collectionTitle}></CollectionCard>
      ))}
    </div>
  )
};


export default CollectionsPage