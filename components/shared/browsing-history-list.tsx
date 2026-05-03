'use client'

import useBrowsingHistory from '@/hooks/use-browsing-history'
import React, { useEffect } from 'react'
import ProductSlider from './product/product-slider'
import { useTranslations } from 'next-intl'
import { Separator } from '../ui/separator'
import { cn } from '@/lib/utils'

type BrowsingProduct = {
  id: string
  category: string
}

export default function BrowsingHistoryList({
  className,
}: {
  className?: string
}) {
  const { products } = useBrowsingHistory()
  const t = useTranslations('Home')

  return (
    products.length !== 0 && (
      <div className='bg-background' id='browsing-history'>
        <Separator className={cn('mb-4', className)} />

        <ProductList
          title={t("Related to items that you've viewed")}
          type='related'
        />

        <Separator className='mb-4' />

        <ProductList
          title={t('Your browsing history')}
          hideDetails
          type='history'
        />
      </div>
    )
  )
}

function ProductList({
  title,
  type = 'history',
  hideDetails = false,
  excludeId = '',
}: {
  title: string
  type: 'history' | 'related'
  excludeId?: string
  hideDetails?: boolean
}) {
  const { products } = useBrowsingHistory()
  const [data, setData] = React.useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      const uniqueProducts = products.filter(
        (product: BrowsingProduct, index: number, self: BrowsingProduct[]) =>
          index === self.findIndex((p) => p.id === product.id)
      )

      const res = await fetch(
        `/api/products/browsing-history?type=${type}&excludeId=${excludeId}&categories=${uniqueProducts
          .map((product: BrowsingProduct) => product.category)
          .join(',')}&ids=${uniqueProducts
          .map((product: BrowsingProduct) => product.id)
          .join(',')}`
      )

      const data = await res.json()
      setData(data)
    }

    fetchProducts()
  }, [excludeId, products, type])

  return (
    data.length > 0 && (
      <ProductSlider
        title={title}
        products={data}
        hideDetails={hideDetails}
      />
    )
  )
}