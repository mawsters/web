import { CollectionQueryResponse } from "@/types/collections"
import { PropsWithChildren, createContext, useContext } from "react"
import { Button, ButtonLoading } from "./ui/Button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card"
import { Avatar, AvatarFallback } from "./ui/Avatar"
import { AvatarImage } from "@radix-ui/react-avatar"
import Book from "./Book"
import { cn } from "@/utils/dom"
import { CreateCollectionForm } from "./Collection.CreateForm"
import React from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/Dropdown-Menu"
import { DotsHorizontalIcon} from "@radix-ui/react-icons"
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu"
import { EditCollectionForm } from "./Collection.EditForm"
import { useDeleteCollectionMutation } from "@/data/clients/collections.api"

//#endregion  //*======== CONTEXT ===========
export type CollectionContext = {
  collection: CollectionQueryResponse,
  isSkeleton?: boolean,
  isEdit?: boolean,
  setIsEdit?: (e: boolean) => void,
  isDelete?: boolean,
  setIsDelete?: (e: boolean) => void,
}
const CollectionContext = createContext<CollectionContext | undefined>(undefined)
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
  const [isEdit, setIsEdit] = React.useState(false);
  const [isDelete, setIsDelete] = React.useState(false);

  return (
    <CollectionContext.Provider
      value={{ isSkeleton: !Object.keys(value?.collection ?? {}).length, isEdit, isDelete, setIsEdit, setIsDelete, ...value }}

    >
      {children}
    </CollectionContext.Provider>
  )
}

const CollectionViewCardDropdown = ({ className }: { className: string }) => {

  const { setIsEdit, setIsDelete } = useCollectionContext();

  const handleEdit = () => {
    // pull up the dialog by setting isDelete to true
    setIsEdit!(true);

  }

  const handleDelete = () => {
    // pull up the dialog by setting isDelete to true
    setIsDelete!(true);
  }

  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <DotsHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-5">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleEdit}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export const CollectionViewCard = ({ className }: { className: string }) => {
  const { collection, isSkeleton, isEdit, isDelete } = useCollectionContext();
  const navigate = useNavigate();

  const handleClick = () => {


    navigate(`/collections/${collection.id}`)


  }
  return (
    <>
      {!isSkeleton && <div className={className}>
        <Button onClick={handleClick} className={className}>
          {collection.title}
        </Button>
        <CollectionViewCardDropdown className="absolute mt-5 top-2 right-2 bg-primary text-primary-foreground shadow hover:bg-primary/90" />
      </div>}
      {isEdit && <CollectionViewCardEditDialog />}
      {isDelete && <CollectionViewCardDeleteDialog />}
      {isSkeleton && <ButtonLoading className={className}></ButtonLoading>}
    </>
  )
}
Collection.ViewCard = CollectionViewCard;

export type CollectionHeader = Card;
export const CollectionHeader = () => {
  const { collection } = useCollectionContext();
  return (
    <div className="flex box-border w-[500px]">
      <Card className="flex mt-5 w-full">
        <CardHeader className="flex justify-self-center">
          <Avatar className="m-2">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>?</AvatarFallback>
          </Avatar>
          <CardTitle className="m-2">{collection.title}</CardTitle>
        </CardHeader>
      </Card>
    </div>

  )
}

Collection.Header = CollectionHeader;

export type CollectionBookList = Card;
export const CollectionBookList = () => {
  const { collection } = useCollectionContext();
  return (
    <div className="box-border w-[500px]">
      <Card className="flex flex-col mt-5 w-full ">
        <CardHeader className="flex justify-self-center">
          <CardTitle className="m-2">Book Details</CardTitle>
        </CardHeader>
        {collection.booklist.map((book: Book, idx) => (
          console.log("Book", book),
          <CardContent key={book.key} className="flex flex-row space-x-2">
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
              <p>{book.author}</p>
            </div>

          </CardContent>
        ))}
      </Card>
    </div>

  )
}

Collection.BookList = CollectionBookList;

export type CollectionCreateButton = Dialog;
export const CollectionCreateButton = () => {
  const [open, setOpen] = React.useState(false);


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create Collection</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Collection</DialogTitle>
          <DialogDescription>
            Make changes to your collection here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <CreateCollectionForm className="flex min-w-full min-h-full" setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  )
}

export type CollectionViewCardEditDialog = Dialog;
export const CollectionViewCardEditDialog = () => {
  const { collection, isEdit, setIsEdit } = useCollectionContext();


  return (
    <Dialog open={isEdit} onOpenChange={setIsEdit!}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Collection</DialogTitle>
          <DialogDescription>
            Make changes to your collection here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <EditCollectionForm className="flex min-w-full min-h-full" setOpen={setIsEdit!} id={collection.id} />
      </DialogContent>
    </Dialog>
  )
}
Collection.EditDialog = CollectionViewCardEditDialog

export const CollectionViewCardDeleteDialog = () => {
  const { collection, isDelete, setIsDelete } = useCollectionContext();
  const [deleteCollection] =  useDeleteCollectionMutation();


  return (
    <Dialog open={isDelete} onOpenChange={setIsDelete!}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Collection</DialogTitle>
          <DialogDescription>
            This deletion is permanent. Are you sure you want to proceed?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => deleteCollection(collection.id)}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
Collection.EditDialog = CollectionViewCardEditDialog
