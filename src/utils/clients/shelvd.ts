import { BookSource, List } from '@/types/shelvd'
import { createSlug } from '@/utils/helpers'

export class ShelvdUtils {
  static source: BookSource = 'shelvd'
  static coreListNames: string[] = ['To Read', 'Reading', 'Completed', 'DNF']

  static createCoreLists = (): List[] => {
    const lists: List[] = ShelvdUtils.coreListNames.map((name) => {
      const slug = createSlug(name)
      const source = BookSource.enum.shelvd

      const list: List = {
        key: slug,
        source,
        name,
        books: [],
      }

      return list
    })

    return lists
  }
}
