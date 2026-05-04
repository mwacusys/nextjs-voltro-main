import * as React from 'react'
import Link from 'next/link'
import { X, ChevronRight, UserCircle, MenuIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SignOut } from '@/lib/actions/user.actions'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { auth } from '@/auth'
import { getLocale, getTranslations } from 'next-intl/server'
import { getDirection } from '@/i18n-config'

export default async function Sidebar({
  departmentCategories,
}: {
  departmentCategories: Record<string, string[]>
}) {
  const session = await auth()
  const locale = await getLocale()
  const t = await getTranslations()

  return (
    <Drawer direction={getDirection(locale) === 'rtl' ? 'right' : 'left'}>
      <DrawerTrigger className='header-button flex items-center !p-2'>
        <MenuIcon className='h-5 w-5 mr-1' />
        {t('Header.All')}
      </DrawerTrigger>

      <DrawerContent className='w-[350px] mt-0 top-0'>
        <div className='flex flex-col h-full'>
          {/* User Section */}
          <div className='dark bg-gray-800 text-foreground flex items-center justify-between'>
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
              <DrawerDescription />
            </DrawerHeader>

            <DrawerClose asChild>
              <Button variant='ghost' size='icon' className='mr-2'>
                <X className='h-5 w-5' />
              </Button>
            </DrawerClose>
          </div>

          {/* Department + Categories */}
          <div className='flex-1 overflow-y-auto'>
            <nav className='flex flex-col'>
              {Object.entries(departmentCategories).map(
                ([department, categories]) => (
                  <div key={department} className='border-b'>
                    {/* Department (NO capitalize → show as DB value) */}
                    <div className='px-4 py-3 font-semibold'>
                      {department}
                    </div>

                    {/* Categories */}
                    <div className='pb-2'>
                      {categories.map((category) => (
                        <DrawerClose
                          asChild
                          key={`${department}-${category}`}
                        >
                          <Link
                            href={`/search?department=${encodeURIComponent(
                              department
                            )}&category=${encodeURIComponent(category)}`}
                            className='flex items-center justify-between item-button pl-8 text-sm'
                          >
                            <span>{category}</span>
                            <ChevronRight className='h-3 w-3' />
                          </Link>
                        </DrawerClose>
                      ))}
                    </div>
                  </div>
                )
              )}
            </nav>
          </div>

          {/* Footer */}
          <div className='border-t flex flex-col'>
            <div className='p-4'>
              <h2 className='text-lg font-semibold'>
                {t('Header.Help & Settings')}
              </h2>
            </div>

            <DrawerClose asChild>
              <Link href='/account' className='item-button'>
                {t('Header.Your account')}
              </Link>
            </DrawerClose>

            <DrawerClose asChild>
              <Link href='/page/customer-service' className='item-button'>
                {t('Header.Customer Service')}
              </Link>
            </DrawerClose>

            {session ? (
              <form action={SignOut} className='w-full'>
                <Button
                  className='w-full justify-start item-button text-base'
                  variant='ghost'
                >
                  {t('Header.Sign out')}
                </Button>
              </form>
            ) : (
              <DrawerClose asChild>
                <Link href='/sign-in' className='item-button'>
                  {t('Header.Sign in')}
                </Link>
              </DrawerClose>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}