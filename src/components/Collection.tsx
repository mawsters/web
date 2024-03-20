import { SingleCollection } from '@/types/collections'
import { PropsWithChildren, createContext, useContext } from 'react'
import { Button, ButtonLoading } from './ui/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { Avatar, AvatarFallback } from './ui/Avatar'
import { AvatarImage } from '@radix-ui/react-avatar'
import Book from './Book'
import { cn } from '@/utils/dom'
import { CreateCollectionForm } from './Collection.CreateForm'
import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/Dropdown-Menu'
import { Pencil2Icon } from '@radix-ui/react-icons'
import { DropdownMenuGroup } from '@radix-ui/react-dropdown-menu'
import { EditCollectionForm } from './Collection.EditForm'
import {
  useDeleteBookFromCollectionMutation,
  useDeleteCollectionMutation,
} from '@/data/clients/collections.api'
import { logger } from '@/utils/debug'
import { Separator } from './ui/Separator'
import { Badge } from './ui/Badge'

//#endregion  //*======== CONTEXT ===========
export type CollectionContext = {
  collection: SingleCollection
  username: string
  isSkeleton?: boolean
  isEdit?: boolean
  setIsEdit?: (e: boolean) => void
  isDelete?: boolean
  setIsDelete?: (e: boolean) => void
}
const CollectionContext = createContext<CollectionContext | undefined>(
  undefined,
)
const useCollectionContext = () => {
  const ctxValue = useContext(CollectionContext)
  if (ctxValue === undefined) {
    throw new Error(
      'Expected an Context Provider somewhere in the react tree to set context value',
    )
  }
  return ctxValue
}
//#endregion  //*======== CONTEXT ===========

//#endregion  //*======== PROVIDER ===========
type CollectionProvider = PropsWithChildren & CollectionContext
export const Collection = ({ children, ...value }: CollectionProvider) => {
  const [isEdit, setIsEdit] = React.useState(false)
  const [isDelete, setIsDelete] = React.useState(false)

  return (
    <CollectionContext.Provider
      value={{
        isSkeleton: !Object.keys(value?.collection ?? {}).length,
        isEdit,
        isDelete,
        setIsEdit,
        setIsDelete,
        ...value,
      }}
    >
      {children}
    </CollectionContext.Provider>
  )
}

type CollectionViewCardDropdown = HTMLDivElement
const CollectionViewCardDropdown = () => {
  const { setIsEdit, setIsDelete } = useCollectionContext()

  const handleEdit = () => {
    // pull up the dialog by setting isDelete to true
    setIsEdit!(true)
  }

  const handleDelete = () => {
    // pull up the dialog by setting isDelete to true
    setIsDelete!(true)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
          >
            <Pencil2Icon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-5">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export const CollectionViewCard = ({ className }: { className: string }) => {
  const { collection, isSkeleton, isEdit, isDelete, username } =
    useCollectionContext()
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/@${username}/collections/${collection.key}`)
  }
  return (
    <>
      {!isSkeleton && (
        <div className={className}>
          <div className="w-full flex-row items-center justify-start align-baseline">
            <Button
              variant={'link'}
              onClick={handleClick}
              className="ml-2"
            >
              <h3>{collection.name}</h3>
            </Button>

            <CollectionViewCardDropdown />
            <Badge
              className="absolute right-0"
              variant={'outline'}
            >
              {' '}
              {collection.books.length} books
            </Badge>
          </div>
          <Separator />
          {/**Show list of books */}
          <div className="flex min-h-[100px] w-full justify-start">
            {collection.books.length === 0 && (
              <Button
                variant={'outline'}
                className={cn(
                  'ml-4 mt-5',
                  'rounded-lg',
                  'shadow-md',
                  'hover:shadow-xl',
                  'border-2',
                  'h-28 w-20',
                  'flex items-center justify-center',
                )}
                onClick={() => navigate('/trending')}
              >
                <p className="leading-tight text-muted-foreground">Add +</p>
              </Button>
            )}
            {collection.books.map((book) => {
              return (
                <Book
                  key={book.key}
                  book={book}
                >
                  <Book.Thumbnail
                    className={cn(
                      'ml-5 mt-5',
                      'rounded-lg',
                      'shadow-md',
                      'hover:shadow-xl',
                    )}
                  />
                </Book>
              )
            })}
          </div>
        </div>
      )}

      {isEdit && <CollectionViewCardEditDialog />}
      {isDelete && <CollectionViewCardDeleteDialog />}
      {isSkeleton && <ButtonLoading className={className}></ButtonLoading>}
    </>
  )
}
Collection.ViewCard = CollectionViewCard

export type CollectionHeader = Card
export const CollectionHeader = () => {
  const { collection } = useCollectionContext()
  return (
    <div className="h-full w-full">
      <Card className="mt-5 flex w-full">
        <CardHeader className="flex justify-self-center">
          <Avatar className="m-2">
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="@shadcn"
            />
            <AvatarFallback>?</AvatarFallback>
          </Avatar>
          <CardTitle className="m-2">{collection.name}</CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}

Collection.Header = CollectionHeader

export type CollectionBookList = Card
export const CollectionBookList = () => {
  const { collection, username } = useCollectionContext()
  const [deleteBookFromCollection] = useDeleteBookFromCollectionMutation()
  const handleBookDelete = (book_key: string) => {
    // use the hook for deleting book from collection
    deleteBookFromCollection({
      username: username,
      collection_key: collection.key,
      book_key: book_key,
    }).then((res) => {
      logger(
        { breakpoint: `[Collection.BookList:handleBookDelete:177]` },
        `Response: ${res}`,
      )
    })
  }

  return (
    <div className="box-border w-[500px]">
      <Card className="mt-5 flex w-full flex-col ">
        <CardHeader className="m-2 flex justify-self-center">
          <CardTitle className="m-5">Book Details</CardTitle>
        </CardHeader>
        {collection.books.map(
          (book: Book, idx) => (
            console.log('Book', book),
            (
              <CardContent
                key={book.key}
                className="flex flex-row justify-between space-x-2"
              >
                <Book
                  key={book.key}
                  book={book!}
                >
                  <Book.Thumbnail
                    className={cn(
                      idx >= 9 && 'hidden',
                      idx >= 6 && 'hidden lg:block',
                    )}
                  />
                </Book>
                <div className="flex flex-col">
                  <h3>{book.title}</h3>
                  <p>{book.author.name}</p>
                </div>
                <Button
                  className="mr-2"
                  onClick={() => handleBookDelete(book.key)}
                >
                  Delete
                </Button>
              </CardContent>
            )
          ),
        )}
      </Card>
    </div>
  )
}

Collection.BookList = CollectionBookList

export type CollectionCreateButton = Dialog
export const CollectionCreateButton = ({ username }: { username: string }) => {
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="h-10 w-40 rounded-xl border border-transparent bg-black text-sm text-white dark:border-white"
        >
          Create Collection
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Collection</DialogTitle>
          <DialogDescription>
            Make changes to your collection here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <CreateCollectionForm
          className="flex min-h-full min-w-full"
          setOpen={setOpen}
          username={username}
        />
      </DialogContent>
    </Dialog>
  )
}

export type CollectionViewCardEditDialog = Dialog
export const CollectionViewCardEditDialog = () => {
  const { collection, isEdit, setIsEdit, username } = useCollectionContext()

  return (
    <Dialog
      open={isEdit}
      onOpenChange={setIsEdit!}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Collection</DialogTitle>
          <DialogDescription>
            Make changes to your collection here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <EditCollectionForm
          className="flex min-h-full min-w-full"
          setOpen={setIsEdit!}
          collection_key={collection.key}
          username={username}
        />
      </DialogContent>
    </Dialog>
  )
}
Collection.EditDialog = CollectionViewCardEditDialog

export const CollectionViewCardDeleteDialog = () => {
  const { collection, isDelete, setIsDelete, username } = useCollectionContext()
  const [deleteCollection] = useDeleteCollectionMutation()

  return (
    <Dialog
      open={isDelete}
      onOpenChange={setIsDelete!}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Collection</DialogTitle>
          <DialogDescription>
            This deletion is permanent. Are you sure you want to proceed?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() =>
              deleteCollection({
                username: username,
                collection_key: collection.key,
              })
            }
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
Collection.EditDialog = CollectionViewCardEditDialog
