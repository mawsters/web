import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Card } from "./ui/Card";
import { cn } from "@/utils/dom";
import { useAppDispatch } from '@/data/stores/root';
import { deleteCollectionInStore } from '@/data/stores/collection.slice';

export const CollectionCard = ({ title, id }: { title: string, id: number }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const deleteCollection = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        // delete the collection
        dispatch(deleteCollectionInStore(id));
        navigate(`/collections`);
    }

    return (
        <Link to={`/collections/${id}`} className="no-underline w-1/5 max-w-xs m-1 relative group">
            <Card
                className={cn(
                    'flex h-40 place-content-center place-items-center p-0.5 relative',
                    'hover:bg-secondary',
                    'cursor-pointer'
                )}
            >
                <div className="absolute top-0 right-0 p-2">
                    <button onClick={(e) => { e.preventDefault(); setIsOpen(!isOpen); }} className="text-gray-600 hover:text-gray-800">
                        <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </button>
                    {isOpen && (
                        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                            <Link to={`/collections/edit/${id}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit</Link>
                            <button onClick={deleteCollection} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Delete</button>
                        </div>
                    )}
                </div>
                <h1 className="text-center">{title}</h1>
            </Card>
        </Link>
    );
}
