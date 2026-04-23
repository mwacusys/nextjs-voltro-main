import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'

import { formatCurrency } from '@/lib/utils'
import { getSetting } from '@/lib/actions/setting.actions'

/* =========================
   TYPES (CLEAN - NO MONGO)
========================= */

type OrderItem = {
  clientId: string
  name: string
  image: string
  price: number
  quantity: number
  product: string
  slug: string
  category: string
  countInStock: number
}

type OrderEmailType = {
  _id: string
  createdAt?: Date
  updatedAt?: Date

  isPaid?: boolean
  paidAt?: Date

  totalPrice: number
  itemsPrice: number
  taxPrice: number
  shippingPrice: number

  paymentMethod?: string
  expectedDeliveryDate?: Date
  isDelivered?: boolean

  user: {
    name: string
    email: string
  }

  shippingAddress: {
    fullName: string
    street: string
    city: string
    postalCode: string
    country: string
    phone: string
    province: string
  }

  items: OrderItem[]
}

type OrderInformationProps = {
  order: OrderEmailType
}

/* =========================
   PREVIEW DATA (NO CASTING)
========================= */

PurchaseReceiptEmail.PreviewProps = {
  order: {
    _id: '123',
    createdAt: new Date(),
    updatedAt: new Date(),

    isPaid: true,
    paidAt: new Date(),

    totalPrice: 100,
    itemsPrice: 100,
    taxPrice: 0,
    shippingPrice: 0,

    paymentMethod: 'PayPal',
    expectedDeliveryDate: new Date(),
    isDelivered: true,

    user: {
      name: 'John Doe',
      email: 'john.doe@example.com',
    },

    shippingAddress: {
      fullName: 'John Doe',
      street: '123 Main St',
      city: 'New York',
      postalCode: '12345',
      country: 'USA',
      phone: '123-456-7890',
      province: 'New York',
    },

    items: [
      {
        clientId: '123',
        name: 'Product 1',
        image: 'https://via.placeholder.com/150',
        price: 100,
        quantity: 1,
        product: '123',
        slug: 'product-1',
        category: 'Category 1',
        countInStock: 10,
      },
    ],
  },
} satisfies OrderInformationProps

const dateFormatter = new Intl.DateTimeFormat('en', {
  dateStyle: 'medium',
})

/* =========================
   COMPONENT
========================= */

export default async function PurchaseReceiptEmail({
  order,
}: OrderInformationProps) {
  const { site } = await getSetting()

  return (
    <Html>
      <Preview>View order receipt</Preview>
      <Tailwind>
        <Head />
        <Body className='font-sans bg-white'>
          <Container className='max-w-xl'>
            <Heading>Purchase Receipt</Heading>

            {/* ORDER SUMMARY */}
            <Section>
              <Row>
                <Column>
                  <Text className='mb-0 text-gray-500'>Order ID</Text>
                  <Text className='mt-0'>{order._id}</Text>
                </Column>

                <Column>
                  <Text className='mb-0 text-gray-500'>Purchased On</Text>
                  <Text className='mt-0'>
                    {order.createdAt
                      ? dateFormatter.format(order.createdAt)
                      : '-'}
                  </Text>
                </Column>

                <Column>
                  <Text className='mb-0 text-gray-500'>Price Paid</Text>
                  <Text className='mt-0'>
                    {formatCurrency(order.totalPrice)}
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* ITEMS */}
            <Section className='border border-gray-300 rounded-lg p-4 my-4'>
              {order.items.map((item) => (
                <Row key={item.product} className='mt-6'>
                  <Column className='w-20'>
                    <Link href={`${site.url}/product/${item.slug}`}>
                      <Img
                        width='80'
                        alt={item.name}
                        className='rounded'
                        src={
                          item.image.startsWith('/')
                            ? `${site.url}${item.image}`
                            : item.image
                        }
                      />
                    </Link>
                  </Column>

                  <Column>
                    <Link href={`${site.url}/product/${item.slug}`}>
                      <Text className='mx-2 my-0'>
                        {item.name} x {item.quantity}
                      </Text>
                    </Link>
                  </Column>

                  <Column align='right'>
                    <Text>{formatCurrency(item.price)}</Text>
                  </Column>
                </Row>
              ))}

              {/* TOTALS */}
              {[
                { name: 'Items', price: order.itemsPrice },
                { name: 'Tax', price: order.taxPrice },
                { name: 'Shipping', price: order.shippingPrice },
                { name: 'Total', price: order.totalPrice },
              ].map(({ name, price }) => (
                <Row key={name}>
                  <Column align='right'>{name}:</Column>
                  <Column align='right' width={80}>
                    <Text>{formatCurrency(price)}</Text>
                  </Column>
                </Row>
              ))}
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
