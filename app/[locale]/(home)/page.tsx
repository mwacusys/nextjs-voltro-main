import Link from 'next/link'
import BrowsingHistoryList from '@/components/shared/browsing-history-list'
import { HomeCard } from '@/components/shared/home/home-card'
import ProductSlider from '@/components/shared/product/product-slider'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'

import {
  getProductsForCard,
  getProductsByTag,
  getAllCategories,
} from '@/lib/actions/product.actions'
import { toSlug } from '@/lib/utils'
import { getTranslations, getLocale } from 'next-intl/server'

export default async function HomePage() {
  const t = await getTranslations('Home')
  const locale = await getLocale()

  const todaysDeals = await getProductsByTag({ tag: 'todays-deal' })
  const bestSellingProducts = await getProductsByTag({ tag: 'best-seller' })

  const categories = (await getAllCategories()).slice(0, 4)

  const newArrivals = await getProductsForCard({ tag: 'new-arrival' })
  const featureds = await getProductsForCard({ tag: 'featured' })
  const bestSellers = await getProductsForCard({ tag: 'best-seller' })

  const allProducts = await getProductsByTag({ tag: 'featured' })

  const categoryItems = categories.map((category) => {
    const productsInCategory = allProducts.filter(
      (product) => product.category === category
    )

    const randomProduct =
      productsInCategory.length > 0
        ? productsInCategory[
            Math.floor(Math.random() * productsInCategory.length)
          ]
        : null

    let image = `/images/${toSlug(category)}.jpg`

    if (randomProduct?.images?.length) {
      image =
        randomProduct.images[
          Math.floor(Math.random() * randomProduct.images.length)
        ]
    }

    return {
      name: category,
      image,
      href: `/${locale}/search?category=${encodeURIComponent(category)}`,
    }
  })

  const cards = [
    {
      title: t('Categories to explore'),
      link: {
        text: t('See More'),
        href: `/${locale}/search`,
      },
      items: categoryItems,
    },
    {
      title: t('Explore New Arrivals'),
      items: newArrivals,
      link: {
        text: t('View All'),
        href: `/${locale}/search?tag=new-arrival`,
      },
    },
    {
      title: t('Discover Best Sellers'),
      items: bestSellers,
      link: {
        text: t('View All'),
        href: `/${locale}/search?tag=best-seller`,
      },
    },
    {
      title: t('Featured Products'),
      items: featureds,
      link: {
        text: t('Shop Now'),
        href: `/${locale}/search?tag=featured`,
      },
    },
  ]

  const heroCategories = [
    'Lithium Batteries',
    'BMS Solutions',
    'Energy Storage',
    'Electronics',
  ]

  const advantages = [
    {
      title: 'High Performance',
      text: 'Reliable and efficient power for modern industrial and energy applications.',
    },
    {
      title: 'Advanced BMS',
      text: 'Smart battery management with protection, monitoring, and safety control.',
    },
    {
      title: 'Long Life Cycle',
      text: 'Engineered for durability, stable output, and long-term operation.',
    },
    {
      title: 'Sustainable Power',
      text: 'Clean energy solutions for a smarter and greener future.',
    },
  ]

  return (
    <>
      {/* PREMIUM HERO */}
      <section className='relative overflow-hidden bg-[#020B13] text-white'>
        {/* Background glow */}
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(34,197,94,0.22),transparent_32%),radial-gradient(circle_at_30%_65%,rgba(14,165,233,0.22),transparent_35%)]' />
        <div className='absolute inset-0 bg-gradient-to-r from-[#020B13] via-[#062033] to-[#020B13]' />

        {/* Grid pattern */}
        <div className='absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.15)_1px,transparent_1px)] [background-size:42px_42px]' />

        <div className='relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-16 md:py-24 lg:grid-cols-2'>
          {/* LEFT CONTENT */}
          <div className='max-w-xl space-y-7'>
            <div className='inline-flex items-center gap-2 rounded-full border border-green-400/30 bg-green-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-green-300 shadow-lg shadow-green-500/10'>
              Welcome to VOLTRO
            </div>

            <div className='space-y-4'>
              <h1 className='text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl'>
                Powering the{' '}
                <span className='bg-gradient-to-r from-green-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent'>
                  Future
                </span>
              </h1>

              <p className='max-w-lg text-base leading-7 text-gray-300 md:text-lg'>
                Advanced lithium batteries, intelligent BMS, and reliable energy
                solutions for a smarter and sustainable tomorrow.
              </p>
            </div>

            <div className='flex flex-wrap gap-4 pt-2'>
              <Link
                href={`/${locale}/search`}
                className='rounded-full bg-green-500 px-8 py-3 text-base font-bold text-white shadow-xl shadow-green-500/30 transition hover:-translate-y-1 hover:scale-105 hover:bg-green-400'
              >
                Explore Products
              </Link>

              <Link
                href={`/${locale}/page/contact`}
                className='rounded-full border border-white/20 bg-white/5 px-8 py-3 text-base font-bold text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white hover:text-[#020B13]'
              >
                Request Inquiry
              </Link>
            </div>

            <div className='grid grid-cols-2 gap-3 pt-6 text-sm md:grid-cols-4'>
              {heroCategories.map((item) => (
                <Link
                  key={item}
                  href={`/${locale}/search`}
                  className='group rounded-2xl border border-white/10 bg-white/5 p-4 font-semibold text-white/90 shadow-lg shadow-black/10 backdrop-blur-md transition hover:-translate-y-1 hover:border-green-400/50 hover:bg-green-400/10'
                >
                  <span className='block h-1 w-8 rounded-full bg-gradient-to-r from-green-300 to-cyan-300 opacity-70 transition group-hover:w-12' />
                  <span className='mt-3 block'>{item}</span>
                </Link>
              ))}
            </div>

            <div className='flex flex-wrap gap-6 pt-4 text-sm text-gray-400'>
              <span>Certified Energy Solutions</span>
              <span>•</span>
              <span>Industrial Grade Reliability</span>
            </div>
          </div>

          {/* RIGHT PRODUCT CARD */}
          <div className='relative flex min-h-[470px] items-center justify-center'>
            <div className='absolute h-[420px] w-[420px] rounded-full bg-green-400/20 blur-3xl' />
            <div className='absolute h-[320px] w-[560px] rounded-full bg-cyan-400/20 blur-3xl' />

            <div className='relative w-full max-w-[640px] rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-[0_30px_100px_rgba(0,0,0,0.65)] backdrop-blur-xl transition hover:-translate-y-2 hover:shadow-[0_40px_120px_rgba(34,197,94,0.18)]'>
              <div className='absolute -inset-px rounded-[2rem] bg-gradient-to-br from-green-400/30 via-cyan-400/10 to-transparent opacity-70' />

              <div className='relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#041625]'>
                <Image
                  src='/images/banner/voltro-home-banner.png'
                  alt='VOLTRO Energy Products'
                  width={900}
                  height={600}
                  priority
                  className='h-[420px] w-full object-cover'
                />

                <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#020B13] via-[#020B13]/70 to-transparent p-5'>
                  <div className='grid grid-cols-3 gap-3 rounded-2xl border border-white/10 bg-[#041625]/90 p-4 shadow-xl backdrop-blur'>
                    <div>
                      <p className='text-lg font-extrabold text-green-300'>
                        BMS
                      </p>
                      <p className='text-xs text-gray-400'>Smart Protection</p>
                    </div>
                    <div>
                      <p className='text-lg font-extrabold text-cyan-300'>
                        48V
                      </p>
                      <p className='text-xs text-gray-400'>Energy Systems</p>
                    </div>
                    <div>
                      <p className='text-lg font-extrabold text-white'>
                        UN 38.3
                      </p>
                      <p className='text-xs text-gray-400'>Safety Ready</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className='absolute -right-5 -top-5 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-bold text-white shadow-xl backdrop-blur'>
                VOLTRO Energy
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className='bg-white px-6 py-16'>
        <div className='mx-auto max-w-7xl'>
          <div className='mx-auto mb-10 max-w-2xl text-center'>
            <p className='text-sm font-bold uppercase tracking-[0.25em] text-green-600'>
              Why Choose VOLTRO
            </p>
            <h2 className='mt-3 text-4xl font-extrabold tracking-tight text-[#061624]'>
              Built for Safe, Smart, and Sustainable Power
            </h2>
            <p className='mt-4 text-gray-600'>
              Reliable energy products designed for performance, safety, and
              long life.
            </p>
          </div>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-4'>
            {advantages.map((item, index) => (
              <div
                key={item.title}
                className='group rounded-3xl border bg-gray-50 p-6 shadow-sm transition hover:-translate-y-2 hover:border-green-300 hover:shadow-xl'
              >
                <div className='mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#061624] text-lg font-extrabold text-green-300 shadow-lg'>
                  {index + 1}
                </div>

                <h3 className='text-lg font-extrabold text-[#061624]'>
                  {item.title}
                </h3>

                <p className='mt-3 text-sm leading-6 text-gray-600'>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCT SECTIONS */}
      <div className='bg-border md:space-y-4 md:p-4'>
        <HomeCard cards={cards} />

        <Card className='w-full rounded-none'>
          <CardContent className='items-center gap-3 p-4'>
            <ProductSlider title={t("Today's Deals")} products={todaysDeals} />
          </CardContent>
        </Card>

        <Card className='w-full rounded-none'>
          <CardContent className='items-center gap-3 p-4'>
            <ProductSlider
              title={t('Best Selling Products')}
              products={bestSellingProducts}
              hideDetails
            />
          </CardContent>
        </Card>
      </div>

      <div className='bg-background p-4'>
        <BrowsingHistoryList />
      </div>
    </>
  )
}