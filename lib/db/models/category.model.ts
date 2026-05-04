import { Schema, model, models, Types } from 'mongoose'

export interface ICategory {
  _id: Types.ObjectId
  name: string
  slug: string
  parent?: Types.ObjectId | null
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
  },
  { timestamps: true }
)

export const Category =
  models.Category || model<ICategory>('Category', categorySchema)