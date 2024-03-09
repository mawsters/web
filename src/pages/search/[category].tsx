import Search from '@/components/Layout.Search'
import { useParams } from '@/router'
import { DefaultSearchCategory } from '@/types/shelvd'
import { useSearchParams } from 'react-router-dom'

const SearchCategoryPage = () => {
  const { category = DefaultSearchCategory } = useParams('/search/:category')
  const [searchParams] = useSearchParams()

  return (
    <main>
      <Search.Form
        isNavigatable
        defaults={{
          category: category as typeof DefaultSearchCategory,
          q: searchParams.get('q') ?? '',
          page: +(searchParams.get('page') ?? 1),
        }}
      />
      <Search.Results />
      <Search.Pagination isNavigatable />
    </main>
  )
}

export default SearchCategoryPage
