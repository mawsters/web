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
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card"
import { Avatar, AvatarFallback } from "./ui/Avatar"
import { AvatarImage } from "@radix-ui/react-avatar"
import Book from "./Book"
import { cn } from "@/utils/dom"
// import { useCreateCollectionMutation } from "@/data/clients/collections.api"

//#endregion  //*======== CONTEXT ===========
export type CollectionContext = {
  collection: CollectionQueryResponse,
  isSkeleton?: boolean
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
export const Collection = ({ children, ...value }: CollectionProvider) => (
  <CollectionContext.Provider
    value={{ ...value, isSkeleton: !Object.keys(value?.collection ?? {}).length }}
  >
    {children}
  </CollectionContext.Provider>
)


export const CollectionViewCard = ({className} : {className: string}) => {
  const { collection, isSkeleton } = useCollectionContext();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/collections/${collection.id}`)
  }
  return (
    <>
      {!isSkeleton && <Button onClick={handleClick} className={className}>{collection.title}</Button>}
      {isSkeleton && <ButtonLoading className={className}></ButtonLoading>}
    </>
  )
}
Collection.ViewCard = CollectionViewCard;

export type CollectionHeader = Card; 
export const CollectionHeader = () => {
  const {collection} = useCollectionContext();
  return (
      <Card className="flex m-5 w-[500px]">
        <CardHeader className="flex justify-self-center">
          <Avatar className="m-2">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn"/>
            <AvatarFallback>?</AvatarFallback>
          </Avatar>
          <CardTitle className="m-2">{collection.title}</CardTitle>
        </CardHeader>
      </Card>      
  )
}

Collection.Header = CollectionHeader;

export type CollectionBookList = Card;
export const CollectionBookList = () => {
  const {collection} = useCollectionContext();
  return(
      <Card className="flex flex-col w-[500px]">
        <CardHeader className="flex justify-self-center">
          <CardTitle className="m-2">Book Details</CardTitle>
        </CardHeader>
        {collection.booklist.map((book: Book, idx) => (
          console.log("Book",book),
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
            <p>{book.title}</p>
          </CardContent>
        ))}
      </Card>
  )
}

Collection.BookList = CollectionBookList;

export type CollectionCreateCard = Dialog;
export const CollectionCreateCard = () => {
  // const [createCollection, result] = useCreateCollectionMutation();



  return (
    <Dialog>
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
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Title
            </Label>
            <Input id="name" value="Title" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
Collection.CreateCard = CollectionCreateCard;


