import { Outlet } from 'react-router-dom'

const BookLayout = () => {
  return (
    <main className="page-container">
      <Outlet />
    </main>
  )
}

export default BookLayout
