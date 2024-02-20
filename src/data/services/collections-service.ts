import { Collection } from "@/types/collection";

// temporarily using localStorage.
// in the future, this should be replaced with actual CRUD endpoints

// get collections
const getAll = async () => {
    const collections = JSON.parse(localStorage.getItem('collections') ?? '[]');
    return collections;
};

// create collection
const create = async (newCollection: Collection) => {
    const collections = await getAll();
    const updatedCollections = [...collections, newCollection];
    localStorage.setItem('collections', JSON.stringify(updatedCollections));
};

// update collection
const update = async ({ id, updatedField }: { id: number, updatedField: Collection }) => {
    const collections = await getAll();
    const collection = collections.find((collection: Collection) => collection.collectionId === id);
    const updatedCollection = { ...collection, updatedField };
    const updatedCollections = [...collections, updatedCollection];
    localStorage.setItem('collections', JSON.stringify(updatedCollections));
};

// delete collection
const deleteCollection = async (id: number) => {
    const collections = await getAll();
    const updatedCollections = collections.map((collection: Collection) => collection.collectionId !== id);
    localStorage.setItem('collections', JSON.stringify(updatedCollections));

};

export default { getAll, create, update, deleteCollection };
