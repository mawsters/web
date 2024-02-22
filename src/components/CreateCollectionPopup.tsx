import { addToCollections } from '@/data/stores/collection.slice'
import { useAppDispatch } from '@/data/stores/root'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Popup component for creating a new collection, styled with Tailwind CSS
const CreateCollectionPopup = () => {
  const [title, setTitle] = useState('')
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const onCreate = () => {
    // dispatch redux to add new collection
    dispatch(addToCollections(title))
    // navigate back to collections
    navigate(`/collections`)
  }

  return (
    <div className="fixed left-1/2 top-1/4 z-50 -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white p-4 shadow-lg">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Collection Title"
          className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
          onClick={onCreate}
        >
          Create
        </button>
      </div>
    </div>
  )
}

export default CreateCollectionPopup
