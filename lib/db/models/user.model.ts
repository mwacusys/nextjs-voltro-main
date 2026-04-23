import { IUserInput } from '@/types'
import { Document, Model, model, models, Schema } from 'mongoose'

export interface IUser extends Document, IUserInput {
  createdAt: Date
  updatedAt: Date
}
export type UserClient = {
  _id: string
  createdAt: string
  updatedAt: string
} & IUserInput

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, required: true, default: 'User' },
    password: { type: String },
    image: { type: String },
    emailVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
)

const User = (models.User as Model<IUser>) || model<IUser>('User', userSchema)

export default User
