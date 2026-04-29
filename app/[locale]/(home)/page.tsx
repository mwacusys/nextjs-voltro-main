import BrowsingHistoryList from '@/components/shared/browsing-history-list'
import { HomeCard } from '@/components/shared/home/home-card'
import { HomeCarousel } from '@/components/shared/home/home-carousel'
import ProductSlider from '@/components/shared/product/product-slider'
import { Card, CardContent } from '@/components/ui/card'

import { getAllProducts } from '@/lib/actions/product.actions'
import { getCategoryTree } from '@/lib/actions/category.actions'
import { getSetting } from '@/lib/actions/setting.actions'
import { getTranslations } from 'next-intl/server'

export default async function HomePage() {
  const t = await getTranslations('Home')

  /* ================= SETTINGS ================= */
  const { carousels } = await getSetting()

  /* ================= CATEGORIES ================= */
  const categoryTree = await getCategoryTree()
  const categories = categoryTree.slice(0, 4)

  /* ================= PRODUCTS (ONE QUERY ONLY) ================= */
  const { products } = await getAllProducts({
    query: 'all',
    category: 'all',
    tag: 'all',
    page: 1,
    limit: 100,
  })

  /* ================= SPLIT IN MEMORY ================= */
  const todaysDeals = products.filter((p) => p.tags?.includes('todays-deal'))

  const bestSellingProducts = products.filter((p) =>
    p.tags?.includes('best-seller'),
  )

  const newArrivals = products.filter((p) => p.tags?.includes('new-arrival'))

  const featureds = products.filter((p) => p.tags?.includes('featured'))

  /* ================= CARDS ================= */
  const cards = [
    {
      title: t('Categories to explore'),
      link: {
        text: t('See More'),
        href: '/search',
      },
      items: categories.map((cat) => ({
        name: cat.name,
        image: `/images/${cat.slug}.jpg`,
        href: `/search?category=${cat.slug}`,
      })),
    },

    {
      title: t('Explore New Arrivals'),
      items: newArrivals.map((p) => ({
        name: p.name,
        image: p.images?.[0] || '/placeholder.jpg',
        href: `/product/${p.slug}`,
      })),
      link: {
        text: t('View All'),
        href: '/search?tag=new-arrival',
      },
    },

    {
      title: t('Discover Best Sellers'),
      items: bestSellingProducts.map((p) => ({
        name: p.name,
        image: p.images?.[0] || '/placeholder.jpg',
        href: `/product/${p.slug}`,
      })),
      link: {
        text: t('View All'),
        href: '/search?tag=best-seller',
      },
    },

    {
      title: t('Featured Products'),
      items: featureds.map((p) => ({
        name: p.name,
        image: p.images?.[0] || '/placeholder.jpg',
        href: `/product/${p.slug}`,
      })),
      link: {
        text: t('Shop Now'),
        href: '/search?tag=featured',
      },
    },
  ]
  /* ================= UI ================= */
  return (
    <>
      <HomeCarousel items={carousels} />

      <div className='md:p-4 md:space-y-4 bg-border'>
        <HomeCard cards={cards} />

        <Card className='w-full rounded-none'>
          <CardContent className='p-4 items-center gap-3'>
            <ProductSlider title={t("Today's Deals")} products={todaysDeals} />
          </CardContent>
        </Card>

        <Card className='w-full rounded-none'>
          <CardContent className='p-4 items-center gap-3'>
            <ProductSlider
              title={t('Best Selling Products')}
              products={bestSellingProducts}
              hideDetails
            />
          </CardContent>
        </Card>
      </div>

      <div className='p-4 bg-background'>
        <BrowsingHistoryList />
      </div>
    </>
  )
}
