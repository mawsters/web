import Search from '@/components/Layout.Search'

const SearchCategoryPage = () => {
  // const { category = Hardcover.DefaultSearchCategory } = useParams('/search/:category')

  return (
    <main>
      <Search.Results />
    </main>
  )
}

export default SearchCategoryPage
