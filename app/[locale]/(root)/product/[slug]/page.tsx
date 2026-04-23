import { auth } from '@/auth'
import AddToCart from '@/components/shared/product/add-to-cart'
import { Card, CardContent } from '@/components/ui/card'
import {
  getProductBySlug,
  getRelatedProductsByCategory,
} from '@/lib/actions/product.actions'

import ReviewList from './review-list'
import { generateId, round2 } from '@/lib/utils'
import SelectVariant from '@/components/shared/product/select-variant'
import ProductPrice from '@/components/shared/product/product-price'
import ProductGallery from '@/components/shared/product/product-gallery'
import AddToBrowsingHistory from '@/components/shared/product/add-to-browsing-history'
import { Separator } from '@/components/ui/separator'
import BrowsingHistoryList from '@/components/shared/browsing-history-list'
import RatingSummary from '@/components/shared/product/rating-summary'
import ProductSlider from '@/components/shared/product/product-slider'
import { getTranslations } from 'next-intl/server'

/* ✅ STRICT TYPE */
export type RatingDistribution = {
  rating: number
  count: number
}[]

type ProductClient = {
  _id: string
  slug: string
  category: string
  avgRating: number
  numReviews: number
  ratingDistribution: RatingDistribution

  name: string
  images: string[]

  price: number
  listPrice?: number
  brand: string
  description: string
  countInStock: number
  sizes: string[]
  colors: string[]
  tags: string[]
}
type RatingDistributionItem = {
  rating: number
  count: number
}

/* ✅ FIX: no `any` */
export function normalizeRatingDistribution(
  data: Record<string, number>,
): RatingDistributionItem[] {
  return Object.entries(data || {}).map(([rating, count]) => ({
    rating: Number(rating),
    count: Number(count),
  }))
}

/* ✅ METADATA */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const t = await getTranslations()
  const { slug } = await params

  const product = await getProductBySlug(slug)

  if (!product) {
    return { title: t('Product.Product not found') }
  }

  return {
    title: product.name,
    description: product.description,
  }
}

/* ✅ PAGE */
export default async function ProductDetails({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string; color?: string; size?: string }>
}) {
  const { slug } = await params
  const { page, color, size } = await searchParams

  const session = await auth()

  const product = await getProductBySlug(slug)
  if (!product) return null

  const productId = product._id.toString()

  const productClient: ProductClient = {
    _id: productId,
    slug: product.slug,
    category: product.category,
    avgRating: product.avgRating,
    numReviews: product.numReviews,
    ratingDistribution: product.ratingDistribution,

    name: product.name,
    images: product.images,

    price: product.price,
    listPrice: product.listPrice,
    brand: product.brand,
    description: product.description,
    countInStock: product.countInStock,
    sizes: product.sizes,
    colors: product.colors,
    tags: product.tags,
  }

  const relatedProducts = await getRelatedProductsByCategory({
    category: product.category,
    productId,
    page: Number(page || '1'),
  })

  const t = await getTranslations()

  return (
    <div>
      <AddToBrowsingHistory id={productId} category={product.category} />

      {/* PRODUCT */}
      <section>
        <div className='grid grid-cols-1 md:grid-cols-5'>
          <div className='col-span-2'>
            <ProductGallery images={product.images} />
          </div>

          <div className='flex flex-col gap-2 md:p-5 col-span-2'>
            <p className='p-medium-16 rounded-full bg-grey-500/10 text-grey-500'>
              {t('Product.Brand')} {product.brand} {product.category}
            </p>

            <h1 className='font-bold text-lg lg:text-xl'>{product.name}</h1>

            <RatingSummary
              avgRating={product.avgRating}
              numReviews={product.numReviews}
              ratingDistribution={productClient.ratingDistribution}
              asPopover
            />

            <Separator />

            <ProductPrice
              price={product.price}
              listPrice={product.listPrice}
              isDeal={product.tags.includes('todays-deal')}
              forListing={false}
            />

            <SelectVariant
              product={product}
              size={size || product.sizes[0]}
              color={color || product.colors[0]}
            />

            <Separator />

            <p>{product.description}</p>
          </div>

          {/* BUY */}
          <div>
            <Card>
              <CardContent className='p-4 flex flex-col gap-4'>
                <ProductPrice price={product.price} />

                {product.countInStock !== 0 && (
                  <AddToCart
                    item={{
                      clientId: generateId(),
                      product: productId,
                      countInStock: product.countInStock,
                      name: product.name,
                      slug: product.slug,
                      category: product.category,
                      price: round2(product.price),
                      quantity: 1,
                      image: product.images[0],
                      size: size || product.sizes[0],
                      color: color || product.colors[0],
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className='mt-10'>
        <ReviewList product={productClient} userId={session?.user?.id} />
      </section>

      {/* RELATED */}
      <section className='mt-10'>
        <ProductSlider
          products={relatedProducts.data}
          title={t('Product.Best Sellers in', {
            name: product.category,
          })}
        />
      </section>

      {/* HISTORY */}
      <BrowsingHistoryList className='mt-10' />
    </div>
  )
}
