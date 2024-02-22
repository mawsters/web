import { updateCollection } from '@/data/stores/collection.slice'
import { useAppDispatch } from '@/data/stores/root'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// Popup component for creating a new collection, styled with Tailwind CSS
const UpdateCollectionPopup = () => {
  const [title, setTitle] = useState('')
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { slug } = useParams()

  const onUpdate = () => {
    // currently coded to update title only
    // dispatch redux to update collection title
    dispatch(updateCollection(Number(slug), { collectionTitle: title }))
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
          onClick={onUpdate}
        >
          Update
        </button>
      </div>
    </div>
  )
}

export default UpdateCollectionPopup
