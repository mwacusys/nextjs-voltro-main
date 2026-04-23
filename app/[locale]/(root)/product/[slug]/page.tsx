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

/* ✅ SAFE TYPE */
type RatingDistribution = Record<number, number>

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

/* ✅ Normalize Mongo object safely */
function normalizeRatingDistribution(input: any): RatingDistribution {
  return {
    1: Number(input?.[1] ?? input?.['1'] ?? 0),
    2: Number(input?.[2] ?? input?.['2'] ?? 0),
    3: Number(input?.[3] ?? input?.['3'] ?? 0),
    4: Number(input?.[4] ?? input?.['4'] ?? 0),
    5: Number(input?.[5] ?? input?.['5'] ?? 0),
  }
}

/* ✅ Metadata */
export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}) {
  const t = await getTranslations()
  const { slug } = await props.params

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
export default async function ProductDetails(props: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string; color?: string; size?: string }>
}) {
  const { page, color, size } = await props.searchParams
  const { slug } = await props.params

  const session = await auth()

  const product = await getProductBySlug(slug)
  if (!product) return null

  const productId = product._id.toString()

  /* ✅ CLIENT SAFE OBJECT */
  const productClient: ProductClient = {
    _id: productId,
    slug: product.slug,
    category: product.category,
    avgRating: product.avgRating,
    numReviews: product.numReviews,
    ratingDistribution: normalizeRatingDistribution(product.ratingDistribution),

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
    category: productClient.category,
    productId,
    page: Number(page || '1'),
  })

  const t = await getTranslations()

  return (
    <div>
      {/* HISTORY */}
      <AddToBrowsingHistory
        id={productClient._id}
        category={productClient.category}
      />

      {/* PRODUCT SECTION */}
      <section>
        <div className='grid grid-cols-1 md:grid-cols-5 gap-6'>
          {/* IMAGE */}
          <div className='col-span-2'>
            <ProductGallery images={productClient.images} />
          </div>

          {/* DETAILS */}
          <div className='flex flex-col gap-3 md:p-5 col-span-2'>
            <p className='p-medium-16 rounded-full bg-grey-500/10 text-grey-500'>
              {t('Product.Brand')} {productClient.brand}{' '}
              {productClient.category}
            </p>

            <h1 className='font-bold text-lg lg:text-xl'>
              {productClient.name}
            </h1>

            <RatingSummary
              avgRating={productClient.avgRating}
              numReviews={productClient.numReviews}
              ratingDistribution={productClient.ratingDistribution}
              asPopover
            />

            <Separator />

            <ProductPrice
              price={productClient.price}
              listPrice={productClient.listPrice}
              isDeal={productClient.tags.includes('todays-deal')}
              forListing={false}
            />

            <SelectVariant
              product={productClient}
              size={size || productClient.sizes?.[0] || ''}
              color={color || productClient.colors?.[0] || ''}
            />

            <Separator />

            <p>{productClient.description}</p>
          </div>

          {/* BUY CARD */}
          <div>
            <Card>
              <CardContent className='p-4 flex flex-col gap-4'>
                <ProductPrice price={productClient.price} />

                {/* STOCK INFO */}
                {productClient.countInStock > 0 &&
                  productClient.countInStock <= 3 && (
                    <div className='text-destructive font-bold'>
                      {t('Product.Only X left in stock - order soon', {
                        count: productClient.countInStock,
                      })}
                    </div>
                  )}

                {productClient.countInStock === 0 && (
                  <div className='text-destructive text-xl'>
                    {t('Product.Out of Stock')}
                  </div>
                )}

                {/* ADD TO CART */}
                {productClient.countInStock !== 0 && (
                  <AddToCart
                    item={{
                      clientId: generateId(),
                      product: productClient._id,
                      countInStock: productClient.countInStock,
                      name: productClient.name,
                      slug: productClient.slug,
                      category: productClient.category,
                      price: round2(productClient.price),
                      quantity: 1,
                      image: productClient.images?.[0] || '',
                      size: size || productClient.sizes?.[0] || '',
                      color: color || productClient.colors?.[0] || '',
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
        <h2 className='h2-bold mb-2'>{t('Product.Customer Reviews')}</h2>

        <ReviewList product={productClient} userId={session?.user.id} />
      </section>

      {/* RELATED PRODUCTS */}
      <section className='mt-10'>
        <ProductSlider
          products={relatedProducts.data}
          title={t('Product.Best Sellers in', {
            name: productClient.category,
          })}
        />
      </section>

      {/* BROWSING HISTORY */}
      <BrowsingHistoryList className='mt-10' />
    </div>
  )
}
