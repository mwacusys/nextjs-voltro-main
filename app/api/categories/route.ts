import { NextRequest, NextResponse } from 'next/server'
import { Category } from '@/lib/db/models/category.model'
import dbConnect from '@/lib/db/connect'

export async function GET(req: NextRequest) {
  await dbConnect()

  const parent = req.nextUrl.searchParams.get('parent')

  const categories = await Category.find({
    parent: parent === 'null' ? null : parent,
  })

  return NextResponse.json(categories)
}