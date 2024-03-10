import Author from '@/components/Author'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert'
import { useRootSelector } from '@/data/stores/root'
import { SearchSelectors } from '@/data/stores/search.slice'
import { useParams } from '@/router'
import {
  AuthorDetailCategory,
  DefaultAuthorDetailCategory,
} from '@/types/shelvd'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'

const AuthorDetailPage = () => {
  const { '*': category = DefaultAuthorDetailCategory } =
    useParams('/author/:slug?/*')

  const current = useRootSelector(SearchSelectors.state).current
  // const origin = current.origin as SourceOrigin<'hc', 'authors'>
  // const author = current.common as SearchArtifact<'authors'>

  const isValidCategory = current.category === 'authors'
  const isValidSubcategory = AuthorDetailCategory.safeParse(category).success

  if (
    !isValidCategory ||
    !isValidSubcategory ||
    current.isLoading ||
    current.isNotFound
  )
    return null
  return (
    <>
      {!AuthorDetailCategory.safeParse(category).success && (
        <Alert
          variant="warning"
          className="my-4 mb-8"
        >
          <ExclamationTriangleIcon className="size-4" />
          <AlertTitle>WIP</AlertTitle>
          <AlertDescription>This feature is in development</AlertDescription>
        </Alert>
      )}

      {category === AuthorDetailCategory.enum.books && (
        <section>
          <Author.Books />
        </section>
      )}

      {category === AuthorDetailCategory.enum.series && (
        <section>
          <Author.Series />
        </section>
      )}
    </>
  )
}

export default AuthorDetailPage
