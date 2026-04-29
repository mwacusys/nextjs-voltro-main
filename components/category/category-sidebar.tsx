'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'

export type CategoryNode = {
  _id: string
  name: string
  slug: string
  children: CategoryNode[]
}

/* ================= ITEM ================= */

function CategoryItem({
  node,
  level = 0,
  currentCategory,
}: {
  node: CategoryNode
  level?: number
  currentCategory: string
}) {
  const hasChildren = node.children.length > 0

  // ✅ auto-open if current category is inside subtree
  const shouldOpenByDefault = useMemo(() => {
    if (!currentCategory) return false
    if (node.slug === currentCategory) return true

    const checkChildren = (children: CategoryNode[]): boolean => {
      for (const c of children) {
        if (c.slug === currentCategory) return true
        if (checkChildren(c.children)) return true
      }
      return false
    }

    return checkChildren(node.children)
  }, [node, currentCategory])

  const [open, setOpen] = useState(shouldOpenByDefault)

  const isActive = node.slug === currentCategory

  return (
    <div>
      <div
        className={`flex items-center justify-between py-1`}
        style={{ paddingLeft: level * 14 }}
      >
        {/* CATEGORY LINK */}
        <Link
          href={`/search?category=${node.slug}`}
          className={`flex-1 hover:underline ${
            isActive ? 'text-primary font-semibold' : ''
          }`}
        >
          {node.name}
        </Link>

        {/* TOGGLE BUTTON */}
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation() // ✅ prevent link click
              setOpen(!open)
            }}
            className='text-xs px-2 text-gray-500 hover:text-black'
          >
            {open ? '−' : '+'}
          </button>
        )}
      </div>

      {/* CHILDREN */}
      {open &&
        node.children.map((child) => (
          <CategoryItem
            key={child._id}
            node={child}
            level={level + 1}
            currentCategory={currentCategory}
          />
        ))}
    </div>
  )
}

/* ================= SIDEBAR ================= */

export default function CategorySidebar({
  categories,
}: {
  categories: CategoryNode[]
}) {
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category') || ''

  return (
    <div className='w-64 border-r p-3 bg-white'>
      <h2 className='font-bold mb-3 text-lg'>Categories</h2>

      {/* ALL OPTION */}
      <Link
        href='/search'
        className={`block mb-2 ${
          currentCategory === '' ? 'text-primary font-semibold' : ''
        }`}
      >
        All
      </Link>

      {/* TREE */}
      {categories.map((cat) => (
        <CategoryItem
          key={cat._id}
          node={cat}
          currentCategory={currentCategory}
        />
      ))}
    </div>
  )
}
