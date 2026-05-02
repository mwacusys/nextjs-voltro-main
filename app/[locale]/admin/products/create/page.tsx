import Link from 'next/link'
import ProductForm from '../product-form'
import { Metadata } from 'next'
import { getLocale } from 'next-intl/server'

export const metadata: Metadata = {
  title: 'Create Product',
}

const CreateProductPage = async () => {
  const locale = await getLocale()

  return (
    <main className='max-w-6xl mx-auto p-4'>
      <div className='flex mb-4'>
        <Link href={`/${locale}/admin/products`}>Products</Link>
        <span className='mx-1'>›</span>
        <Link href={`/${locale}/admin/products/create`}>Create</Link>
      </div>

      <div className='my-8'>
        <ProductForm type='Create' />
      </div>
    </main>
  )
}

export default CreateProductPage