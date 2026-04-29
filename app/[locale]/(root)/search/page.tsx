import Link from 'next/link'

import Pagination from '@/components/shared/pagination'
import ProductCard from '@/components/shared/product/product-card'

import { getAllProducts, getAllTags } from '@/lib/actions/product.actions'

import { IProduct } from '@/lib/db/models/product.model'

import ProductSortSelector from '@/components/shared/product/product-sort-selector'

import CollapsibleOnMobile from '@/components/shared/collapsible-on-mobile'
import { getTranslations } from 'next-intl/server'

import CategorySidebar from '@/components/category/category-sidebar'
import { getCategoryTree } from '@/lib/actions/category.actions'

import { getFilterUrl, toSlug } from '@/lib/utils'

/* ================= METADATA ================= */
export async function generateMetadata(props: {
  searchParams: Promise<{
    q?: string
    category?: string
    tag?: string
    price?: string
    rating?: string
    sort?: string
    page?: string
  }>
}) {
  const searchParams = await props.searchParams
  const t = await getTranslations()

  const { q = 'all', category = 'all' } = searchParams

  return {
    title:
      q !== 'all' || category !== 'all'
        ? `${t('Search.Search')} ${q}`
        : t('Search.Search Products'),
  }
}

/* ================= MAIN PAGE ================= */
export default async function SearchPage(props: {
  searchParams: Promise<{
    q?: string
    category?: string
    tag?: string
    price?: string
    rating?: string
    sort?: string
    page?: string
  }>
}) {
  const searchParams = await props.searchParams

  const {
    q = 'all',
    category = 'all',
    tag = 'all',
    price = 'all',
    rating = 'all',
    sort = 'best-selling',
    page = '1',
  } = searchParams

  const params = {
    q,
    category,
    tag,
    price,
    rating,
    sort,
    page: String(page),
  }

  /* ================= DATA ================= */
  const categoryTree = await getCategoryTree()
  const tags = await getAllTags()

  const data = await getAllProducts({
    category,
    tag,
    query: q,
    price,
    rating,
    page: Number(page),
    sort,
  })

  const t = await getTranslations()

  /* ================= UI ================= */
  return (
    <div className='flex gap-4'>
      {/* ================= SIDEBAR ================= */}
      <div className='w-64 hidden md:block'>
        <CategorySidebar categories={categoryTree} />
      </div>

      {/* ================= CONTENT ================= */}
      <div className='flex-1'>
        {/* TOP BAR */}
        <div className='my-2 bg-card md:border-b flex-between flex-col md:flex-row'>
          <div>
            {data.totalProducts === 0
              ? t('Search.No')
              : `${data.from}-${data.to} ${t('Search.of')} ${data.totalProducts}`}{' '}
            {t('Search.results')}
          </div>

          <ProductSortSelector
            sortOrders={[
              { value: 'price-low-to-high', name: 'Price: Low to high' },
              { value: 'price-high-to-low', name: 'Price: High to low' },
              { value: 'best-selling', name: 'Best selling' },
            ]}
            sort={sort}
            params={params}
          />
        </div>

        <div className='grid md:grid-cols-5 md:gap-4'>
          {/* ================= FILTERS ================= */}
          <CollapsibleOnMobile title={t('Search.Filters')}>
            <div className='space-y-4'>
              {/* PRICE */}
              <div>
                <div className='font-bold'>{t('Search.Price')}</div>
                <ul>
                  <li>
                    <Link href={getFilterUrl({ price: 'all', params })}>
                      {t('Search.All')}
                    </Link>
                  </li>
                  {[
                    { name: '$1 to $20', value: '1-20' },
                    { name: '$21 to $50', value: '21-50' },
                  ].map((p) => (
                    <li key={p.value}>
                      <Link
                        href={getFilterUrl({ price: p.value, params })}
                        className={price === p.value ? 'text-primary' : ''}
                      >
                        {p.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* TAG */}
              <div>
                <div className='font-bold'>{t('Search.Tag')}</div>
                <ul>
                  {(tags || []).map((tagName: string) => (
                    <li key={tagName}>
                      <Link
                        href={getFilterUrl({
                          tag: toSlug(tagName), // ✅ FIXED
                          params,
                        })}
                        className={
                          toSlug(tagName) === tag ? 'text-primary' : ''
                        }
                      >
                        {tagName}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CollapsibleOnMobile>

          {/* ================= PRODUCTS ================= */}
          <div className='md:col-span-4 space-y-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {data.products.length === 0 && (
                <div>{t('Search.No product found')}</div>
              )}

              {data.products.map((product: IProduct) => (
                <ProductCard key={String(product._id)} product={product} />
              ))}
            </div>

            {data.totalPages > 1 && (
              <Pagination page={page} totalPages={data.totalPages} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
