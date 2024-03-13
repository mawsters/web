import Search from '@/components/Layout.Search'
import { useParams } from '@/router'
import { DefaultSearchCategory } from '@/types/shelvd'
import { cn } from '@/utils/dom'
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
      <Search.Results
        className={cn(
          // 'max-h-[80dvh] w-full',
          'w-full',
          'flex flex-col gap-6',
          'my-6',
          'snap-y snap-proximity overflow-y-auto',
        )}
      />
      <Search.Pagination isNavigatable />
    </main>
  )
}

export default SearchCategoryPage
