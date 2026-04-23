import { IWebPageInput } from '@/types'
import { Document, Model, model, models, Schema } from 'mongoose'

export interface IWebPage extends Document, IWebPageInput {
  createdAt: Date
  updatedAt: Date
}
export type WebPageClient = {
  _id: string
  createdAt: string
  updatedAt: string
} & IWebPageInput

const webPageSchema = new Schema<IWebPage>(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    isPublished: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

const WebPage =
  (models.WebPage as Model<IWebPage>) ||
  model<IWebPage>('WebPage', webPageSchema)

export default WebPage
