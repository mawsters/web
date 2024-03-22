import WIPAlert from '@/components/Layout.WIP'
import { Button } from '@/components/ui/Button'

const UserLists = () => {
  return (
    <div>
      created, following
      <div className="space-x-4 space-y-4 rounded border-2 border-dashed border-indigo-600 p-4">
        <WIPAlert />
        <Button onClick={() => {}}>Create List</Button>
      </div>
    </div>
  )
}

export default UserLists
