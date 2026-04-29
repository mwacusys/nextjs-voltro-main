'use server'

import { connectToDatabase } from '@/lib/db'
import Category, { ICategory } from '@/lib/db/models/category.model'

export type CategoryNode = {
  _id: string
  name: string
  slug: string
  parent: string | null
  children: CategoryNode[]
}

export async function getCategoryTree(): Promise<CategoryNode[]> {
  await connectToDatabase()

  // ✅ Sort for consistent UI
  const categories = await Category.find().sort({ name: 1 }).lean<ICategory[]>()

  const map: Record<string, CategoryNode> = {}
  const tree: CategoryNode[] = []

  /* ================= BUILD MAP ================= */
  for (const c of categories) {
    map[c._id.toString()] = {
      _id: c._id.toString(),
      name: c.name,
      slug: c.slug,
      parent: c.parent ? c.parent.toString() : null,
      children: [],
    }
  }

  /* ================= BUILD TREE ================= */
  for (const c of categories) {
    const id = c._id.toString()

    if (c.parent) {
      const parentId = c.parent.toString()

      if (map[parentId]) {
        map[parentId].children.push(map[id])
      } else {
        // ⚠️ Debug safety
        console.warn(`Missing parent category for ${c.name}`)
        tree.push(map[id]) // fallback
      }
    } else {
      tree.push(map[id])
    }
  }

  return tree
}
