import * as React from 'react'
import Link from 'next/link'
import { X, ChevronRight, UserCircle, MenuIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SignOut } from '@/lib/actions/user.actions'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { auth } from '@/auth'
import { getLocale, getTranslations } from 'next-intl/server'
import { getDirection } from '@/i18n-config'

type CategoryGroup = {
  title: string
  items: string[]
}

export default async function Sidebar({
  categories,
}: {
  categories: string[]
}) {
  const session = await auth()
  const locale = await getLocale()
  const t = await getTranslations()

  const menu: CategoryGroup[] = [
    { title: t('Header.Shop By Battery'), items: categories },
    { title: t('Header.Shop By BMS'), items: categories },
    { title: t('Header.Shop By Embedded'), items: categories },
    { title: t('Header.Shop By Chargers'), items: categories },
    { title: t('Header.Shop By Power Conversion Systems'), items: categories },
    { title: t('Header.Shop By Components'), items: categories },
  ]

  return (
    <Drawer direction={getDirection(locale) === 'rtl' ? 'right' : 'left'}>
      {/* 🔘 Trigger */}
      <DrawerTrigger className='header-button flex items-center !p-2'>
        <MenuIcon className='h-5 w-5 mr-1' />
        {t('Header.All')}
      </DrawerTrigger>

      {/* 📦 Sidebar */}
      <DrawerContent className='w-[350px] mt-0 top-0 border-r border-gray-300 shadow-lg'>
        <div className='flex flex-col h-screen'>
          {/* ✅ HEADER */}
          <div className='bg-gray-800 text-white flex items-center justify-between'>
            <DrawerHeader>
              <DrawerTitle className='flex items-center'>
                <UserCircle className='h-6 w-6 mr-2' />
                {session ? (
                  <DrawerClose asChild>
                    <Link href='/account'>
                      <span className='text-lg font-semibold'>
                        {t('Header.Hello')}, {session.user.name}
                      </span>
                    </Link>
                  </DrawerClose>
                ) : (
                  <DrawerClose asChild>
                    <Link href='/sign-in'>
                      <span className='text-lg font-semibold'>
                        {t('Header.Hello')}, {t('Header.sign in')}
                      </span>
                    </Link>
                  </DrawerClose>
                )}
              </DrawerTitle>
            </DrawerHeader>

            <DrawerClose asChild>
              <Button variant='ghost' size='icon' className='mr-2 text-white'>
                <X className='h-5 w-5' />
              </Button>
            </DrawerClose>
          </div>

          {/* ✅ SINGLE SCROLL AREA */}
          <div className='flex-1 overflow-y-auto pb-6'>
            {/* 🔹 CATEGORY SECTIONS */}
            {menu.map((group, index) => (
              <div key={index}>
                <div className='p-4 border-b'>
                  <h2 className='text-lg font-semibold'>{group.title}</h2>
                </div>

                <nav className='flex flex-col'>
                  {group.items.map((category) => (
                    <DrawerClose asChild key={`${group.title}-${category}`}>
                      <Link
                        href={`/search?category=${category}`}
                        className='flex items-center justify-between px-4 py-3 hover:bg-gray-100'
                      >
                        <span>{category}</span>
                        <ChevronRight className='h-4 w-4' />
                      </Link>
                    </DrawerClose>
                  ))}
                </nav>
              </div>
            ))}

            {/* ✅ HELP & SETTINGS */}
            <div className='border-t mt-4'>
              <div className='p-4'>
                <h2 className='text-lg font-semibold'>
                  {t('Header.Help & Settings')}
                </h2>
              </div>

              <DrawerClose asChild>
                <Link
                  href='/account'
                  className='block px-4 py-3 hover:bg-gray-100'
                >
                  {t('Header.Your account')}
                </Link>
              </DrawerClose>

              <DrawerClose asChild>
                <Link
                  href='/page/customer-service'
                  className='block px-4 py-3 hover:bg-gray-100'
                >
                  {t('Header.Customer Service')}
                </Link>
              </DrawerClose>

              {session ? (
                <form action={SignOut}>
                  <Button
                    className='w-full justify-start px-4 py-3 text-base'
                    variant='ghost'
                  >
                    {t('Header.Sign out')}
                  </Button>
                </form>
              ) : (
                <DrawerClose asChild>
                  <Link
                    href='/sign-in'
                    className='block px-4 py-3 hover:bg-gray-100'
                  >
                    {t('Header.Sign in')}
                  </Link>
                </DrawerClose>
              )}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
