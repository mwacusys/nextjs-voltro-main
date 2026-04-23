'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Calendar, StarIcon, User } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useInView } from 'react-intersection-observer'
import { z } from 'zod'
import { useTranslations } from 'next-intl'

import Rating from '@/components/shared/product/rating'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form, FormControl, FormField } from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { useToast } from '@/hooks/use-toast'
import { createUpdateReview, getReviews } from '@/lib/actions/review.actions'
import { ReviewInputSchema } from '@/lib/validator'
import RatingSummary from '@/components/shared/product/rating-summary'
import { Separator } from '@/components/ui/separator'
import { IReviewDetails } from '@/types'

/* ✅ SAFE TYPE */
type RatingDistribution = {
  rating: number
  count: number
}[]

type ProductClient = {
  _id: string
  slug: string
  avgRating: number
  numReviews: number
  ratingDistribution: RatingDistribution
}

export default function ReviewList({
  userId,
  product,
}: {
  userId?: string
  product: ProductClient
}) {
  const t = useTranslations('Product')
  const { toast } = useToast()

  const productId = product._id

  const [reviews, setReviews] = useState<IReviewDetails[]>([])
  const [page, setPage] = useState(2)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)

  const { ref, inView } = useInView({ triggerOnce: true })

  /* 🔁 INITIAL LOAD */
  useEffect(() => {
    if (!inView) return

    const load = async () => {
      setLoading(true)
      const res = await getReviews({ productId, page: 1 })
      setReviews(res.data)
      setTotalPages(res.totalPages)
      setLoading(false)
    }

    load()
  }, [inView, productId])

  /* 🔁 LOAD MORE */
  const loadMore = async () => {
    if (page > totalPages || loading) return

    setLoading(true)
    const res = await getReviews({ productId, page })

    setReviews((prev) => [...prev, ...res.data])
    setPage((p) => p + 1)
    setLoading(false)
  }

  /* 🔁 RELOAD AFTER SUBMIT */
  const reload = async () => {
    const res = await getReviews({ productId, page: 1 })
    setReviews(res.data)
    setTotalPages(res.totalPages)
    setPage(2)
  }

  /* 🧾 FORM */
  type FormData = z.infer<typeof ReviewInputSchema>

  const form = useForm<FormData>({
    resolver: zodResolver(ReviewInputSchema),
    defaultValues: { title: '', comment: '', rating: 0 },
  })

  const [open, setOpen] = useState(false)

  const onSubmit: SubmitHandler<FormData> = async (values) => {
    const res = await createUpdateReview({
      data: { ...values, product: productId },
      path: `/product/${product.slug}`,
    })

    if (!res.success) {
      return toast({
        variant: 'destructive',
        description: res.message,
      })
    }

    setOpen(false)
    await reload()

    toast({ description: res.message })
  }

  return (
    <div className='space-y-4'>
      {/* SUMMARY */}
      {reviews.length > 0 && (
        <RatingSummary
          avgRating={product.avgRating}
          numReviews={product.numReviews}
          ratingDistribution={product.ratingDistribution}
        />
      )}

      <Separator />

      {/* REVIEW FORM */}
      {userId ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <Button onClick={() => setOpen(true)}>
            {t('Write a customer review')}
          </Button>

          <DialogContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <DialogHeader>
                  <DialogTitle>{t('Write a review')}</DialogTitle>
                </DialogHeader>

                <FormField
                  control={form.control}
                  name='rating'
                  render={({ field }) => (
                    <Select
                      onValueChange={(v) => field.onChange(Number(v))}
                      value={String(field.value)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select rating' />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <SelectItem key={n} value={n.toString()}>
                            {n} <StarIcon className='inline w-4 h-4 ml-1' />
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                <DialogFooter>
                  <Button type='submit'>{t('Submit')}</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      ) : (
        <Link href={`/sign-in?callbackUrl=/product/${product.slug}`}>
          {t('Sign in to review')}
        </Link>
      )}

      {/* REVIEWS LIST */}
      {reviews.map((r) => (
        <Card key={String(r._id)}>
          <CardHeader>
            <CardTitle>{r.title}</CardTitle>
          </CardHeader>

          <CardContent>
            <Rating rating={r.rating} />

            <div className='flex gap-2 text-sm items-center'>
              <User className='w-4 h-4' />
              {r.user?.name || t('Deleted User')}

              <Calendar className='w-4 h-4 ml-2' />
              {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* LOAD MORE */}
      <div ref={ref}>
        {page <= totalPages && (
          <Button variant='link' onClick={loadMore}>
            {loading ? t('Loading') : t('See more reviews')}
          </Button>
        )}
      </div>
    </div>
  )
}
