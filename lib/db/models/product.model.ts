import { Document, Schema, model, models, Types } from 'mongoose'

export interface IProduct extends Document {
  _id: Types.ObjectId

  name: string
  slug: string

  category: Types.ObjectId
  subcategory?: Types.ObjectId
  subSubcategory?: Types.ObjectId

  images: string[]
  brand?: string

  price: number
  listPrice?: number

  countInStock: number
  description?: string

  avgRating: number
  numReviews: number

  ratingDistribution: {
    rating: number
    count: number
  }[]

  numSales: number

  sizes: string[]
  colors: string[]

  tags: string[]

  isPublished: boolean

  createdAt: Date
  updatedAt: Date
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },

    /* ================= CATEGORY ================= */

    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true, // ✅ important
    },

    subcategory: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },

    subSubcategory: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },

    /* ================= BASIC ================= */

    images: { type: [String], default: [] },
    brand: { type: String, default: '' },

    price: { type: Number, required: true },
    listPrice: { type: Number, default: 0 },

    countInStock: { type: Number, default: 0 },
    description: { type: String, default: '' },

    /* ================= REVIEWS ================= */

    avgRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },

    ratingDistribution: [
      {
        rating: { type: Number },
        count: { type: Number },
      },
    ],

    numSales: { type: Number, default: 0 },

    /* ================= VARIANTS ================= */

    sizes: { type: [String], default: [] },
    colors: { type: [String], default: [] },

    tags: { type: [String], default: [] },

    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true },
)

/* ================= INDEXES ================= */

// Faster filtering
productSchema.index({ category: 1 })
productSchema.index({ subcategory: 1 })
productSchema.index({ subSubcategory: 1 })

const Product = models.Product || model<IProduct>('Product', productSchema)

export default Product
