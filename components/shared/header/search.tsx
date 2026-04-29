import { SearchIcon } from 'lucide-react'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'

import { getCategoryTree } from '@/lib/actions/category.actions'
import { getSetting } from '@/lib/actions/setting.actions'
import { getTranslations } from 'next-intl/server'

export default async function Search() {
  const {
    site: { name },
  } = await getSetting()

  const categories = await getCategoryTree()
  const t = await getTranslations()

  // convert CategoryNode[] → string[]
  const categoryNames = categories.map((c) => c.name)

  return (
    <form action='/search' method='GET' className='flex items-stretch h-10'>
      {/* CATEGORY SELECT */}
      <Select name='category'>
        <SelectTrigger className='w-auto h-full bg-gray-100 text-black border-r rounded-r-none rounded-l-md'>
          <SelectValue placeholder={t('Header.All')} />
        </SelectTrigger>

        <SelectContent position='popper'>
          <SelectItem value='all'>{t('Header.All')}</SelectItem>

          {categoryNames.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* SEARCH INPUT */}
      <Input
        className='flex-1 rounded-none bg-gray-100 text-black text-base h-full'
        placeholder={t('Header.Search Site', { name })}
        name='q'
        type='search'
      />

      {/* BUTTON */}
      <button
        type='submit'
        className='bg-primary text-primary-foreground text-black rounded-s-none rounded-e-md h-full px-3 py-2'
      >
        <SearchIcon className='w-6 h-6' />
      </button>
    </form>
  )
}
