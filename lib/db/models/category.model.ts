import mongoose, { Schema, model, models, Document } from 'mongoose'

export interface ICategory extends Document {
  name: string
  slug: string
  parent?: mongoose.Types.ObjectId | null
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
  },
  { timestamps: true },
)

const Category = models.Category || model<ICategory>('Category', CategorySchema)

export default Category
