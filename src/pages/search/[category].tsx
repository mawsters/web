import Search from '@/components/Layout.Search'
import { useParams } from '@/router'
import { Hardcover } from '@/types'
import { useSearchParams } from 'react-router-dom'

const SearchCategoryPage = () => {
  const { category = Hardcover.DefaultSearchCategory } =
    useParams('/search/:category')
  const [searchParams] = useSearchParams()

  return (
    <main>
      {/* {category} */}
      <Search.Form
        isNavigatable
        defaults={{
          category: category as typeof Hardcover.DefaultSearchCategory,
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
