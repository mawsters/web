import { updateCollection } from '@/data/stores/collection.slice';
import { useAppDispatch } from '@/data/stores/root';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Popup component for creating a new collection, styled with Tailwind CSS
const UpdateCollectionPopup = () => {   
  const [title, setTitle] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {slug} = useParams();

    
  const onUpdate = () => {
    // currently coded to update title only
    // dispatch redux to update collection title
    dispatch(updateCollection(Number(slug), {collectionTitle: title}));
    // navigate back to collections
    navigate(`/collections`);
  }


  return (
    <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 shadow-lg rounded-lg z-50">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Collection Title"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={onUpdate}
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default UpdateCollectionPopup;