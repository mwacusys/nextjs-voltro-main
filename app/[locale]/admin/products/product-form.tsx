'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { createProduct, updateProduct } from '@/lib/actions/product.actions'
import { IProduct } from '@/lib/db/models/product.model'
import { UploadButton } from '@/lib/uploadthing'
import { ProductInputSchema, ProductUpdateSchema } from '@/lib/validator'
import { Checkbox } from '@/components/ui/checkbox'
import { toSlug } from '@/lib/utils'
import { IProductInput } from '@/types'

const productDefaultValues: IProductInput = {
  name: '',
  slug: '',
  category: '',
  images: [],
  brand: '',
  description: '',
  price: 0,
  listPrice: 0,
  countInStock: 0,
  numReviews: 0,
  avgRating: 0,
  numSales: 0,
  isPublished: false,
  tags: [],
  sizes: [],
  colors: [],
  ratingDistribution: [],
  reviews: [],
}

const tagOptions = [
  { label: 'New Arrival', value: 'new-arrival' },
  { label: 'Best Seller', value: 'best-seller' },
  { label: 'Featured', value: 'featured' },
  { label: "Today's Deal", value: 'todays-deal' },
]

const ProductForm = ({
  type,
  product,
  productId,
}: {
  type: 'Create' | 'Update'
  product?: IProduct
  productId?: string
}) => {
  const router = useRouter()
  const locale = useLocale()
  const { toast } = useToast()

  const form = useForm<IProductInput>({
    resolver:
      type === 'Update'
        ? zodResolver(ProductUpdateSchema)
        : zodResolver(ProductInputSchema),
    defaultValues:
      product && type === 'Update' ? product : productDefaultValues,
  })

  const images = form.watch('images') || []

  async function onSubmit(values: IProductInput) {
    if (type === 'Create') {
      const res = await createProduct(values)

      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.message,
        })
        return
      }

      toast({ description: res.message })
      router.push(`/${locale}/admin/products`)
    }

    if (type === 'Update') {
      if (!productId) {
        router.push(`/${locale}/admin/products`)
        return
      }

      const res = await updateProduct({ ...values, _id: productId })

      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.message,
        })
        return
      }

      toast({ description: res.message })
      router.push(`/${locale}/admin/products`)
    }
  }

  return (
    <Form {...form}>
      <form
        method='post'
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8'
      >
        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder='Enter product name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='slug'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Input
                      placeholder='Enter product slug'
                      className='pl-8'
                      {...field}
                    />
                    <button
                      type='button'
                      onClick={() =>
                        form.setValue('slug', toSlug(form.getValues('name')))
                      }
                      className='absolute right-2 top-2.5'
                    >
                      Generate
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={form.control}
            name='category'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder='Enter category' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='brand'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input placeholder='Enter product brand' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={form.control}
            name='listPrice'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>List Price</FormLabel>
                <FormControl>
                  <Input placeholder='Enter product list price' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='price'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Net Price</FormLabel>
                <FormControl>
                  <Input placeholder='Enter product price' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='countInStock'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Count In Stock</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='Enter product count in stock'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='images'
          render={() => (
            <FormItem className='w-full'>
              <FormLabel>Images</FormLabel>
              <Card>
                <CardContent className='space-y-4 mt-2 min-h-48'>
                  {images.length === 0 && (
                    <p className='text-sm text-gray-500'>
                      No images uploaded
                    </p>
                  )}

                  <div className='flex flex-wrap justify-start items-center gap-4'>
                    {images.map((image: string, index: number) => (
                      <div key={image} className='relative'>
                        <Image
                          src={image}
                          alt='product image'
                          className='w-20 h-20 object-cover object-center rounded-sm border'
                          width={100}
                          height={100}
                        />

                        <button
                          type='button'
                          onClick={() => {
                            const updatedImages = images.filter(
                              (_, i) => i !== index
                            )
                            form.setValue('images', updatedImages)
                          }}
                          className='absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center'
                        >
                          ×
                        </button>
                      </div>
                    ))}

                    <FormControl>
                      <UploadButton
                        endpoint='imageUploader'
                        onClientUploadComplete={(res: { url: string }[]) => {
                          if (res && res.length > 0) {
                            form.setValue('images', [...images, res[0].url])
                          }
                        }}
                        onUploadError={(error: Error) => {
                          toast({
                            variant: 'destructive',
                            description: `ERROR! ${error.message}`,
                          })
                        }}
                      />
                    </FormControl>
                  </div>
                </CardContent>
              </Card>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='tags'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Tags</FormLabel>
              <FormDescription>
                Select where this product should appear on the homepage.
              </FormDescription>

              <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                {tagOptions.map((tag) => (
                  <FormItem
                    key={tag.value}
                    className='flex items-center space-x-2 rounded-md border p-3'
                  >
                    <FormControl>
                      <Checkbox
                        checked={(field.value || []).includes(tag.value)}
                        onCheckedChange={(checked) => {
                          const currentTags = field.value || []

                          if (checked) {
                            field.onChange([...currentTags, tag.value])
                          } else {
                            field.onChange(
                              currentTags.filter(
                                (value: string) => value !== tag.value
                              )
                            )
                          }
                        }}
                      />
                    </FormControl>
                    <FormLabel className='font-normal cursor-pointer'>
                      {tag.label}
                    </FormLabel>
                  </FormItem>
                ))}
              </div>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Enter product description'
                  className='resize-none'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Add product features, specifications, and important details.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='isPublished'
          render={({ field }) => (
            <FormItem className='space-x-2 items-center'>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Is Published?</FormLabel>
            </FormItem>
          )}
        />

        <Button
          type='submit'
          size='lg'
          disabled={form.formState.isSubmitting}
          className='button col-span-2 w-full'
        >
          {form.formState.isSubmitting ? 'Submitting...' : `${type} Product`}
        </Button>
      </form>
    </Form>
  )
}

export default ProductForm