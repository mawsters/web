import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card } from './ui/Card'
import { cn } from '@/utils/dom'
import { useAppDispatch } from '@/data/stores/root'
import { deleteCollectionInStore } from '@/data/stores/collection.slice'

export const CollectionCard = ({
  title,
  id,
}: {
  title: string
  id: number
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const deleteCollection = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    // delete the collection
    dispatch(deleteCollectionInStore(id))
    navigate(`/collections`)
  }

  return (
    <Link
      to={`/collections/${id}`}
      className="group relative m-1 w-1/5 max-w-xs no-underline"
    >
      <Card
        className={cn(
          'relative flex h-40 place-content-center place-items-center p-0.5',
          'hover:bg-secondary',
          'cursor-pointer',
        )}
      >
        <div className="absolute right-0 top-0 p-2">
          <button
            onClick={(e) => {
              e.preventDefault()
              setIsOpen(!isOpen)
            }}
            className="text-gray-600 hover:text-gray-800"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
              <Link
                to={`/collections/edit/${id}`}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Edit
              </Link>
              <button
                onClick={deleteCollection}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                Delete
              </button>
            </div>
          )}
        </div>
        <h1 className="text-center">{title}</h1>
      </Card>
    </Link>
  )
}
