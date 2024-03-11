import Book from '@/components/Book'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert'
import { Separator } from '@/components/ui/Separator'
import { useRootSelector } from '@/data/stores/root'
import { SearchSelectors, SourceOrigin } from '@/data/stores/search.slice'
import { useParams } from '@/router'
import {
  BookDetailCategory,
  DefaultBookDetailCategory,
  SearchArtifact,
} from '@/types/shelvd'
import { cn } from '@/utils/dom'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'

const BookDetailPage = () => {
  const { '*': category = DefaultBookDetailCategory } =
    useParams('/book/:slug?/*')

  const current = useRootSelector(SearchSelectors.state).current
  const origin = current.origin as SourceOrigin<'hc', 'books'>
  const book = current.common as SearchArtifact<'books'>

  const isValidCategory = current.category === 'books'
  const isInSeries = !!(book?.series?.key ?? book?.series?.slug)

  if (!isValidCategory || current.isLoading || current.isNotFound) return null
  return (
    <>
      {category === BookDetailCategory.enum.info && (
        <section className="my-4 flex flex-col gap-6">
          <Book.Description />

          <Separator />

          <div
            className={cn(
              'flex flex-col-reverse place-items-start gap-8 lg:flex-row',
              '*:!m-0 *:w-fit',
            )}
          >
            {isInSeries && <Book.Series className="flex-1" />}

            <aside
              className={cn(
                'w-full lg:w-auto lg:basis-2/5',
                'flex flex-col flex-wrap gap-4 lg:flex-row',

                !isInSeries && '!w-full flex-1',
              )}
            >
              <Book.Tags
                title="Genres"
                tags={origin?.genres ?? []}
                className="h-full !w-full"
              />

              <Book.Tags
                title="Moods"
                tags={origin?.moods ?? []}
                className="h-full !w-full"
              />
            </aside>
          </div>
        </section>
      )}

      {category !== BookDetailCategory.enum.info && (
        <Alert
          variant="warning"
          className="my-4 mb-8"
        >
          <ExclamationTriangleIcon className="size-4" />
          <AlertTitle>WIP</AlertTitle>
          <AlertDescription>This feature is in development</AlertDescription>
        </Alert>
      )}
    </>
  )
}

export default BookDetailPage
