'use server'

import mongoose from 'mongoose'
import { connectToDatabase } from '@/lib/db'
import Product, { IProduct } from '@/lib/db/models/product.model'
import Category, { ICategory } from '@/lib/db/models/category.model'
import { revalidatePath } from 'next/cache'
import { formatError } from '../utils'
import { ProductInputSchema, ProductUpdateSchema } from '../validator'
import { IProductInput } from '@/types'
import { z } from 'zod'
import { getSetting } from './setting.actions'

/* ================= HELPERS ================= */

const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id)

/**
 * Get category and ALL its children recursively
 */
async function getCategoryWithChildrenIds(
  categoryId: mongoose.Types.ObjectId,
): Promise<mongoose.Types.ObjectId[]> {
  const children = await Category.find({ parent: categoryId })

  let ids: mongoose.Types.ObjectId[] = [categoryId]

  for (const child of children) {
    const subIds = await getCategoryWithChildrenIds(child._id)
    ids = ids.concat(subIds)
  }

  return ids
}

/**
 * Convert slug OR ObjectId → category ids (with children)
 */
async function buildCategoryFilter(category?: string) {
  if (!category || category === 'all') return {}

  let catDoc: ICategory | null = null

  if (isValidObjectId(category)) {
    catDoc = await Category.findById(category)
  } else {
    catDoc = await Category.findOne({ slug: category })
  }

  if (!catDoc) return { category: null }

  const ids = await getCategoryWithChildrenIds(catDoc._id)

  return { category: { $in: ids } }
}

/* ================= CREATE ================= */

export async function createProduct(data: IProductInput) {
  try {
    const product = ProductInputSchema.parse(data)
    await connectToDatabase()
    await Product.create(product)

    revalidatePath('/admin/products')

    return { success: true, message: 'Product created successfully' }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

/* ================= UPDATE ================= */

export async function updateProduct(data: z.infer<typeof ProductUpdateSchema>) {
  try {
    const product = ProductUpdateSchema.parse(data)
    await connectToDatabase()

    await Product.findByIdAndUpdate(product._id, product)

    revalidatePath('/admin/products')

    return { success: true, message: 'Product updated successfully' }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

/* ================= DELETE ================= */

export async function deleteProduct(id: string) {
  try {
    await connectToDatabase()

    const res = await Product.findByIdAndDelete(id)
    if (!res) throw new Error('Product not found')

    revalidatePath('/admin/products')

    return { success: true, message: 'Product deleted successfully' }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

/* ================= GET ONE ================= */

export async function getProductById(productId: string) {
  await connectToDatabase()

  const product = await Product.findById(productId).populate(
    'category subcategory subSubcategory',
  )

  return JSON.parse(JSON.stringify(product)) as IProduct
}

/* ================= ADMIN LIST ================= */

export async function getAllProductsForAdmin({
  query,
  page = 1,
  sort = 'latest',
  limit,
}: {
  query: string
  page?: number
  sort?: string
  limit?: number
}) {
  await connectToDatabase()

  const {
    common: { pageSize },
  } = await getSetting()

  limit = limit || pageSize

  const queryFilter =
    query && query !== 'all' ? { name: { $regex: query, $options: 'i' } } : {}

  const order: Record<string, 1 | -1> =
    sort === 'best-selling'
      ? { numSales: -1 }
      : sort === 'price-low-to-high'
        ? { price: 1 }
        : sort === 'price-high-to-low'
          ? { price: -1 }
          : sort === 'avg-customer-review'
            ? { avgRating: -1 }
            : { _id: -1 }

  const products = await Product.find(queryFilter)
    .populate('category subcategory subSubcategory')
    .sort(order)
    .skip(limit * (page - 1))
    .limit(limit)
    .lean()

  const countProducts = await Product.countDocuments(queryFilter)

  return {
    products: JSON.parse(JSON.stringify(products)) as IProduct[],
    totalPages: Math.ceil(countProducts / limit),
    totalProducts: countProducts,
  }
}

export async function getAllProducts({
  query,
  category,
  tag,
  price,
  rating,
  sort,
  page,
  limit,
}: {
  query: string
  category: string
  tag: string
  page: number
  limit?: number
  price?: string
  rating?: string
  sort?: string
}) {
  await connectToDatabase()

  const {
    common: { pageSize },
  } = await getSetting()

  limit = limit || pageSize

  const queryFilter =
    query && query !== 'all' ? { name: { $regex: query, $options: 'i' } } : {}

  const categoryFilter = await buildCategoryFilter(category)

  const tagFilter =
    tag && tag !== 'all' ? { tags: { $regex: tag, $options: 'i' } } : {}

  const ratingFilter =
    rating && rating !== 'all' ? { avgRating: { $gte: Number(rating) } } : {}

  const priceFilter =
    price && price !== 'all'
      ? {
          price: {
            $gte: Number(price.split('-')[0]),
            $lte: Number(price.split('-')[1]),
          },
        }
      : {}

  const order: Record<string, 1 | -1> =
    sort === 'best-selling'
      ? { numSales: -1 }
      : sort === 'price-low-to-high'
        ? { price: 1 }
        : sort === 'price-high-to-low'
          ? { price: -1 }
          : sort === 'avg-customer-review'
            ? { avgRating: -1 }
            : { _id: -1 }

  const filter = {
    isPublished: true,
    ...queryFilter,
    ...categoryFilter,
    ...tagFilter,
    ...priceFilter,
    ...ratingFilter,
  }

  const skip = limit * (page - 1)

  const products = await Product.find(filter)
    .populate('category subcategory subSubcategory')
    .sort(order)
    .skip(skip)
    .limit(limit)
    .lean()

  const countProducts = await Product.countDocuments(filter)

  return {
    products: JSON.parse(JSON.stringify(products)) as IProduct[],
    totalPages: Math.ceil(countProducts / limit),
    totalProducts: countProducts,
    from: countProducts === 0 ? 0 : skip + 1,
    to: skip + products.length,
  }
}
export async function getProductsForCard(limit = 8) {
  await connectToDatabase()

  const products = await Product.find({ isPublished: true })
    .sort({ _id: -1 })
    .limit(limit)
    .lean()

  return JSON.parse(JSON.stringify(products))
}
export async function getProductsByTag(tag: string, limit = 8) {
  await connectToDatabase()

  const products = await Product.find({
    isPublished: true,
    tags: { $regex: tag, $options: 'i' },
  })
    .limit(limit)
    .lean()

  return JSON.parse(JSON.stringify(products))
}
/* ================= RELATED ================= */

export async function getRelatedProductsByCategory({
  category,
  productId,
  limit = 4,
  page = 1,
}: {
  category: string
  productId: string
  limit?: number
  page: number
}) {
  await connectToDatabase()

  const categoryFilter = await buildCategoryFilter(category)

  const skip = (page - 1) * limit

  const filter = {
    isPublished: true,
    ...categoryFilter,
    _id: { $ne: productId },
  }

  const products = await Product.find(filter)
    .sort({ numSales: -1 })
    .skip(skip)
    .limit(limit)

  const count = await Product.countDocuments(filter)

  return {
    data: JSON.parse(JSON.stringify(products)) as IProduct[],
    totalPages: Math.ceil(count / limit),
  }
}

/* ================= TAGS ================= */

export async function getAllTags() {
  const tags = await Product.aggregate([
    { $unwind: '$tags' },
    { $group: { _id: null, tags: { $addToSet: '$tags' } } },
  ])

  return tags[0]?.tags || []
}
