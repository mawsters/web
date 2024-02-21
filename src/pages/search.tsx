import BookSearch from '@/components/Book.Search'
import { SearchCategory } from '@/types/ol'
import { useSearchParams } from 'react-router-dom'

const SearchPage = () => {
  const [searchParams] = useSearchParams()

  return (
    <main className="page-container">
      <p>SearchPage</p>
      <pre>
        {JSON.stringify(
          {
            q: searchParams.get('q'),
            category: searchParams.get('type'),
          },
          null,
          2,
        )}
      </pre>

      <main>
        <BookSearch
          showSearchParams
          defaults={{
            query: searchParams.get('q') ?? '',
            category: (searchParams.get('type') as SearchCategory) ?? undefined,
          }}
        >
          <BookSearch.Form />

          <BookSearch.Results />
        </BookSearch>
      </main>
    </main>
  )
}

export default SearchPage
